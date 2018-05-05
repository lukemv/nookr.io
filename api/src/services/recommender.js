// Recomendation wrapper.
const raccoon = require('raccoon');

// Set raccoon environment variables
process.env.RACCOON_REDIS_URL = process.env.RedisHost;
process.env.RACCOON_REDIS_PORT = process.env.RedisPort;
raccoon.config.nearestNeighbors = 3;
raccoon.config.className = 'books';
raccoon.config.numOfRecsStore = 5;

module.exports = {
  liked: (user, item) => {
    console.log(`[raccoon] saved like (user, item) (${user}, ${item}) ${item}`);
    return raccoon.liked(user, item);
  },
  disliked: (user, item) => {
    console.log(`[raccoon] saved dislike (user, item) (${user}, ${item}) ${item}`);
    return raccoon.disliked(user, item);
  },
  bestRated: () => {
    return raccoon.bestRated();
  },
  recommendFor: (user, nRecs) => {
    return raccoon.reccommendFor(user, nRecs);
  }
};
