const axios = require('axios');
const log = require('../services/logger');

const redisOptions = {
  host: process.env.RedisHost,
  port: process.env.RedisPort
};

// Use this single instance redis client where possible
const redisClient = require('../services/redisClient')(redisOptions);

module.exports = {
  volumeQuery: (queryString) => {
    return new Promise((resolve, reject) => {
      redisClient.get(`queries:volumes:${queryString}`, (err, cacheHit) => {
        if (err) {
          log.error('Redis cache error occured');
          log.error(err);
        }
        if (cacheHit !== null) {
          log.info(`Volume query HIT ${queryString}`, 'cache');
          return resolve(JSON.parse(cacheHit));
        }

        log.info(`Volume query MISS ${queryString}`, 'cache');
        const url = `https://www.googleapis.com/books/v1/volumes?${queryString}`;
        axios.get(url).then((res) => {
          // Cache query for fast duplicate search results.
          redisClient.set(`queries:volumes:${queryString}`,
            JSON.stringify(res.data), 'EX', 259200);

          return resolve(res.data);
        }, (err) => {
          log.error('Volume query Google Books error');
          log.error(err);
          reject(err);
        });
      });
    });
  },
  volume: (query) => {
    return new Promise((resolve, reject) => {
      redisClient.get(`queries:single:${query}`, (err, cacheHit) => {
        if (err) {
          log.error('Redis cache error occured');
          log.error(err);
        }
        if (cacheHit !== null) {
          log.info(`Volume query HIT ${query}`, 'cache');
          return resolve(JSON.parse(cacheHit));
        }

        log.info(`Volume query MISS ${query}`, 'cache');
        const url = `https://www.googleapis.com/books/v1/volumes/${query}`;
        axios.get(url).then((res) => {
          // Cache query for fast duplicate search results.
          redisClient.set(`queries:single:${query}`,
            JSON.stringify(res.data), 'EX', 259200);

          return resolve(res.data);
        }, (err) => {
          log.error('Single query Google Books error');
          log.error(err);
          reject(err);
        });
      });
    });
  }
};
