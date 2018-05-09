const config = require('../services/config');
const jwt = require('express-jwt');
// JWT middleware that asserts that a valid JWT
// token exists. session is a Redis wrapper.
module.exports = (session) => {
  return jwt({
    secret: config.jwtSecret,
    isRevoked: (req, payload, done) => {
      const jti = payload.jti;
      const issuer = payload.iss;
      const userId = payload.cid;
      session.isRevoked(issuer, userId, jti, done);
    }
  });
};
