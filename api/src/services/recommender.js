// Recomendation wrapper.
const log = require('./logger');

// Set raccoon environment variables
process.env.RACCOON_REDIS_URL = process.env.RedisHost;
process.env.RACCOON_REDIS_PORT = process.env.RedisPort;

const raccoon = require('raccoon');
raccoon.config.nearestNeighbors = 4;
raccoon.config.className = 'books';
raccoon.config.numOfRecsStore = 20;

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
    log.info('Fetching best rated items', 'raccoon');
    return raccoon.bestRated();
  },
  recommendFor: (user, nRecs) => {
    return raccoon.recommendFor(user, nRecs);
  }
};
