const express = require('express');
const router = express.Router();

const User = require('../models/user');
const payload = require('../models/payload');

module.exports = (passport, session) => {
  // POST /auth/register
  router.post('/register', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) {
        console.error('Passport authentication error');
        console.error(err);
        res.status(500).send(err).end();
      }

      const status = info.messageType === 'signupSuccess' ? 201 : 200;
      res.status(status).send(info).end();
    })(req, res);
  });

  // POST /auth/login
  router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      if (err) {
        console.error('Passport authentication error');
        console.error(err);
        res.status(500).send(err).end();
      }

      res.status(200).send(info).end();
    })(req, res);
  });

  // GET /auth/logoff
  router.get('/logoff', (req, res, next) => {
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

  // GET /auth/profile
  router.get('/profile', (req, res, next) => {
    User.findById(req.user.cid, (err, user) => {
      if (err) {
        return res.status(500).send(payload('error', {message: err.toString()}));
      }

      const pl = payload('profile', {
        message: 'ok',
        user: {
          id: user.id.toString(),
          local: {
            email: user.local.email
          }
        }
      });

      return res.status(200).send(pl);
    });
  });

  return router;
};
