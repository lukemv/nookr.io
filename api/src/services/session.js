const jwt = require('jsonwebtoken');
const config = require('./config');
const redis = require("redis");
const uuid = require('uuid/v4');

module.exports = (redisOptions) => {

  const client = redis.createClient(redisOptions.port, redisOptions.host);

  client.on("error", function (err) {
    console.log("RedisError:" + err);
  });

  return {
    isRevoked: (issuer, userId, jti, done) => {
      client.get(`auth:tokens:${config.jwtIssuer}:${userId}`, (err, res) => {
        if (err) { return done(err); }
        return done(null, res !== jti)
      });
    },
    revokeToken: (issuer, userId, jti, done) =>  {
      return client.del(`auth:tokens:${config.jwtIssuer}:${userId}`, done);
    },
    generateToken: (userId) => {
      const tokenId = uuid();

      // Expires n seconds in the future
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + config.authExpiresSeconds);

      // The key will automatically expire in redis
      client.set(`auth:tokens:${config.jwtIssuer}:${userId}`, tokenId, 'EX', config.authExpiresSeconds);

      const claims = {
        cid: userId,
        jti: tokenId,
        exp: expires.getTime() / 1000,
        permissions: ['read'] // Just in case..
      };

      const token = jwt.sign(claims, config.jwtSecret, {
        issuer: config.jwtIssuer,
        audience: config.jwtAudience
      });

      return { token, expires: config.authExpiresSeconds };
    }
  }
}
