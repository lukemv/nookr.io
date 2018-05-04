const redis = require('redis');

module.exports = (redisOptions) => {
  const client = redis.createClient(
    redisOptions.port,
    redisOptions.host);

  client.on('error', function (err) {
    console.log('RedisError:' + err);
  });

  return client;
};
