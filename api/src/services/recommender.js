// Recomendation wrapper.
const raccoon = require('raccoon');
const log = require('./logger');

// Set raccoon environment variables
process.env.RACCOON_REDIS_URL = process.env.RedisHost;
process.env.RACCOON_REDIS_PORT = process.env.RedisPort;
raccoon.config.nearestNeighbors = 3;
raccoon.config.className = 'books';
raccoon.config.numOfRecsStore = 5;

module.exports = {
  liked: (user, item) => {
    log.info(`Recording like (user, item) (${user}, ${item})`, 'raccoon');
    return raccoon.liked(user, item);
  },
  disliked: (user, item) => {
    log.info(`Recording dislike (user, item) (${user}, ${item})`, 'raccoon');
    return raccoon.disliked(user, item);
  },
  bestRated: () => {
    log.info(`Fetching best rated items`, 'raccoon');
    return raccoon.bestRated();
  },
  recommendFor: (user, nRecs) => {
    return raccoon.reccommendFor(user, nRecs);
  }
};
