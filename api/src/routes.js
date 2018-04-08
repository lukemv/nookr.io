const payload = require('./payload');
const config = require('./config');
const jwt = require('express-jwt');

module.exports = function(app, passport) {
  // Enforce JWT middleware with whitelisted routes.
  app.use(jwt({secret: config.jwtSecret}).unless({path: ['/health', '/register', '/login']}));

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

  app.get('/profile', (req, res, next) => {
    res.status(200).send(payload('profile', {message: 'ok'}));
  });

  app.get('/health', (req, res, next) => {
    res.status(200).send(payload('health', {
      message: {
        health: 'ok'
      }
    }));
  })
};
