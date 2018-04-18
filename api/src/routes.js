const payload = require('./payload');
const config = require('./config');
const jwt = require('express-jwt');
const User = require('./models/user');
const axios = require('axios');
const moment = require('moment');
var mongoose = require('mongoose');
const NYBook = require('./models/nyBook');

module.exports = function(app, passport, session) {
  // Enforce JWT middleware with whitelisted routes.
  const authWhitelist = {path: ['/health', '/register', '/login', '/populateNY']};
  const isRevokedCallback = (req, payload, done) => {
    const issuer = payload.iss;
    const userId = payload.cid;
    const jti = payload.jti;
    session.isRevoked(issuer, userId, jti, done);
  }

  app.use(jwt({
    secret: config.jwtSecret,
    isRevoked: isRevokedCallback
  }).unless(authWhitelist));
  // End of JWT middleware

  app.post('/register', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
      let status = 200;

      if (info.messageType === 'signupSuccess') {
        status = 201;
      }

      res.status(status).send(info).end();
    })(req, res);
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      let status = 200;
      res.status(status).send(info).end();
    })(req, res);
  });

  app.get('/logoff', (req, res, next) => {
    const userId = req.user.cid;
    const jti = req.user.jti;
    const issuer = req.user.iss;
    session.revokeToken(issuer, userId, jti, (err, redisResponse) => {
      const errMsg = 'Failed to revoke session token';

      if (err || redisResponse !== 1) {
        return res.status(500).send(payload('error', {
          message: errMsg
        })).end();
      }

      return res.status(204).send(payload('logoffSuccess', {
        message: 'Logoff Successful!'
      })).end();
    });
  });

  app.get('/profile', (req, res, next) => {
    User.findById(req.user.cid, (err, user) => {
      if (err) {
        return res.status(500).send(payload('error', {message: err.toString()}));
      }

      const pl = payload('profile', {
        message: 'ok',
        user: {
          id: user.id.toString(),
          local: {
            // Attach properties that are on the User model here
            // to pass them on to the client.
            email: user.local.email
          }
        }
      });

      return res.status(200).send(pl);
    })
  });

  app.get('/token', (req, res, next) => {
    const userId = req.user.cid;
    const tExp = session.generateToken(userId)

    const pl = payload('refreshToken', {
      message: 'Token refresh successful',
      token: tExp.token,
      expires: tExp.expires
    });

    return res.status(200).send(pl);
  });

  app.get('/health', (req, res, next) => {
    res.status(200).send(payload('health', {
      message: {
        health: 'ok'
      }
    }));
  });
  app.get('/populateNY', (req, res, next) => {
    console.log('running...')
    mongoose.connection.db.dropCollection('nybooks', function(err, result) {
      if (err) return console.error(err)
    });
    var d = moment()
    var timer = setInterval(function () {
      axios.get('https://api.nytimes.com/svc/books/v3/lists//.json', {
          params: {
            'api-key': '29ff6820315e44e5b7b9060c0aa39d52',
            'list': 'combined-print-and-e-book-fiction',
            'published-date': d.format('YYYY-MM-DD')
          }
        })
        .then((response) => {
          for (let i=0; i<response.data.results.length; i++) {
            console.log(response.data.results[i].book_details[0].title)
            var details = new NYBook({
              title: response.data.results[i].book_details[0].title,
              author: response.data.results[i].book_details[0].author,
              listDate: response.data.results[i].published_date,
              ISBN: response.data.results[i].book_details[0].primary_isbn13
            });
            details.save(function (err, details) {
              if (err) return console.error(err)
            });
          }
        }, (error) => {
          console.log(error)
        })
        d.subtract(7, 'days')
        if (d.isBefore('2013-01-01')) clearInterval(timer)
    }, 300);
    console.log('done!')
  });
};
