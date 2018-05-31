const express = require('express');
const router = express.Router();
const log = require('../services/logger');

const Book = require('../models/book');
const User = require('../models/user');
const payload = require('../models/payload');

const googleBooks = require('../services/books');
const recommender = require('../services/recommender');
const raccoon = require('raccoon');

// GET /books/single?id=foo
router.get('/single', (req, res, next) => {
  const id = req.query.id;
  googleBooks.volume(id).then((volume) => {
    const userId = req.user.cid;
    User.findById(userId, (err, user) => {
      if (err) {
        log.error(err, 'routes/books');
        return res.status(200).send(payload('error', {
          message: 'Failed to find user with ID: ' + userId
        }));
      }

      let rating = user.books.find((item) => {
        return item.bookID === volume.id;
      });

      // yuck..
      if (rating) {
        rating = rating.rating;
      }

      volume.nookrInfo = {
        rating: rating || 0
      };

      const pl = payload('googleVolumeSingle', {volume});
      res.status(200).send(pl);
    });
  }, (err) => {
    return res.status(err.response.status).send(err.message);
  });
});

// GET /books/search?q=foo
router.get('/search', (req, res, next) => {
  log.info('Search - OriginalUrl: ', req.originalUrl);
  var queryIndex = req.originalUrl.indexOf('?');
  log.info('Search - Index of ?: ', queryIndex);
  var queryString = (queryIndex >= 0) ? req.originalUrl.slice(queryIndex + 1) : '';
  log.info('Search - queryStringof ?: ', queryString);

  googleBooks.volumeQuery(queryString).then((volumes) => {
    const userId = req.user.cid;
    User.findById(userId, (err, user) => {
      if (err) {
        log.error(err, '/books/search');
        return res.status(200).send(payload('error', {
          message: 'Failed to find user with ID: ' + userId
        }));
      }

      if (volumes.totalItems === 0) {
        const pl = payload('googleVolumeList', {volumes});
        return res.status(200).send(pl);
      }

      volumes.items = volumes.items.map((volume) => {
        let rating = user.books.find((item) => {
          return item.bookID === volume.id;
        });

        // yuck..
        if (rating) {
          rating = rating.rating;
        }

        volume.nookrInfo = {
          rating: rating || 0
        };

        return volume;
      });

      const pl = payload('googleVolumeList', {volumes});
      res.status(200).send(pl);
    });
  });
});

router.get('/bestRated', (req, res, next) => {
  raccoon.bestRated().then((items) => {
    // Make a promise for each volume,
    // most of these should hit redis
    const promises = items.map((bookId) => {
      return googleBooks.volume(bookId);
    });

    Promise.all(promises).then((books) => {
      const volumes = {
        items: books,
        totalItems: books.length
      };
      const userId = req.user.cid;
      User.findById(userId, (err, user) => {
        if (err) {
          log.error(err, '/books/bestRated');
          return res.status(200).send(payload('error', {
            message: 'Failed to find user with ID: ' + userId
          }));
        }

        if (volumes.totalItems === 0) {
          const pl = payload('googleVolumeList', {volumes});
          return res.status(200).send(pl);
        }

        volumes.items = volumes.items.map((volume) => {
          let rating = user.books.find((item) => {
            return item.bookID === volume.id;
          });

          // yuck..
          if (rating) {
            rating = rating.rating;
          }

          volume.nookrInfo = {
            rating: rating || 0
          };

          return volume;
        });

        const pl = payload('googleVolumeList', {volumes});
        res.status(200).send(pl);
      });
    });
  });
});

router.get('/recommendFor', (req, res, next) => {
  const userId = req.user.cid;
  raccoon.recommendFor(userId, 5).then((items) => {
    // Make a promise for each volume,
    // most of these should hit redis
    const promises = items.map((bookId) => {
      return googleBooks.volume(bookId);
    });

    Promise.all(promises).then((books) => {
      const volumes = {
        items: books,
        totalItems: books.length
      };

      User.findById(userId, (err, user) => {
        if (err) {
          log.error(err, '/books/bestRated');
          return res.status(200).send(payload('error', {
            message: 'Failed to find user with ID: ' + userId
          }));
        }

        if (volumes.totalItems === 0) {
          const pl = payload('googleVolumeList', {volumes});
          return res.status(200).send(pl);
        }

        volumes.items = volumes.items.map((volume) => {
          let rating = user.books.find((item) => {
            return item.bookID === volume.id;
          });

          // yuck..
          if (rating) {
            rating = rating.rating;
          }

          volume.nookrInfo = {
            rating: rating || 0
          };

          return volume;
        });

        const pl = payload('googleVolumeList', {volumes});
        res.status(200).send(pl);
      });
    });
  });
});

// GET /books/trending
router.get('/trending', (req, res, next) => {
  var bookList = [];
  Book.find({}, function (err, books) {
    if (err) {
      res.status(404).send(payload('info', {
        message: 'book not found'
      }));
    }

    // Search through each book and return only the ones rated above or equal to 3
    books.forEach(function (book) {
      if (book.nookrInfo.rating >= 3) {
        bookList.push(book.googleInfo);
      }
    });

    res.status(200).send(payload('book', {
      bookList
    }));
  });
});

module.exports = router;
