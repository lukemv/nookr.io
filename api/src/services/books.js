const axios = require('axios');

const redisOptions = {
  host: process.env.RedisHost,
  port: process.env.RedisPort
};

// Use this single instance redis client where possible
const redisClient = require('../services/redisClient')(redisOptions);

module.exports = {
  volumeQuery: (query) => {
    return new Promise((resolve, reject) => {
      redisClient.get(`queries:volumes:${query}`, (err, cacheHit) => {
        if (err) {
          console.error('Redis cache error occured');
          console.error(err);
        }
        if (cacheHit !== null) {
          console.log('Cache hit!');
          return resolve(JSON.parse(cacheHit));
        }
        console.log('Cache miss!');
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
        axios.get(url).then((res) => {
          // Cache query for fast duplicate search results.
          redisClient.set(`queries:volumes:${query}`,
            JSON.stringify(res.data), 'EX', 500);

          return resolve(res.data);
        });
      });
    });
  },
  volume: (query) => {
    const url = `https://www.googleapis.com/books/v1/volumes/${query}`;
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        resolve(res.data);
      });
    });
  }
};
