const payload = require('./payload');
const config = require('./config');
const jwt = require('express-jwt');
const User = require('./models/user');
const libnook = require('./libnook');

module.exports = function(app, passport, session) {
  // Enforce JWT middleware with whitelisted routes.
  const authWhitelist = {path: ['/health', '/register', '/login', '/googleVolumeSearch']};
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
  })

  app.get('/googleVolumeSearch', (req, res, next) => {
    const q = req.query.q;
    libnook.googleVolumeSearch(q).then((volumes) => {
      res.status(200).send(payload('googleVolumeList', {volumes}));
    });
  });

};
