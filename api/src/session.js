const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = {
  generateToken: (user) => {
    const claims = {
      id: user._id.toString(),
      permissions: ['read'] // Just in case..
    };

    const token = jwt.sign(claims, config.jwtSecret, {
      issuer: config.jwtIssuer,
      audience: config.jwtAudience
    });

    return token;
  }
}
