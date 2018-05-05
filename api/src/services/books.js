const axios = require('axios');

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
          console.error('Redis cache error occured');
          console.error(err);
        }
        if (cacheHit !== null) {
          console.log('[cache] volume query HIT');
          return resolve(JSON.parse(cacheHit));
        }
        console.log('[cache] volume query MISS');
        const url = `https://www.googleapis.com/books/v1/volumes?${queryString}`;
        axios.get(url).then((res) => {
          // Cache query for fast duplicate search results.
          redisClient.set(`queries:volumes:${queryString}`,
            JSON.stringify(res.data), 'EX', 500);

          return resolve(res.data);
        });
      });
    });
  },
  volume: (query) => {
    return new Promise((resolve, reject) => {
      redisClient.get(`queries:single:${query}`, (err, cacheHit) => {
        if (err) {
          console.error('Redis cache error occured');
          console.error(err);
        }
        if (cacheHit !== null) {
          console.log(`[cache] single query HIT ${query}`);
          return resolve(JSON.parse(cacheHit));
        }
        console.log(`[cache] single query MISS ${query}`);
        const url = `https://www.googleapis.com/books/v1/volumes/${query}`;
        axios.get(url).then((res) => {
          // Cache query for fast duplicate search results.
          redisClient.set(`queries:single:${query}`,
            JSON.stringify(res.data), 'EX', 500);

          return resolve(res.data);
        }, (err) => {
          console.error('Single query Google Books error');
          reject(err);
        });
      });
    });
  }
};
