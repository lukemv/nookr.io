const redis = require('redis');
const log = require('./logger');

module.exports = (redisOptions) => {
  const client = redis.createClient(
    redisOptions.port,
    redisOptions.host);

  client.on('error', function (err) {
    log.error(err, 'redis');
  });

  return client;
};
