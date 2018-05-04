const express = require('express');
const router = express.Router();
const Book = require('../models/book');

const googleBooks = require('../services/googleBooks');
const payload = require('../models/payload');

// GET /books/single?id=foo
router.get('/single', (req, res, next) => {
  const id = req.query.id;
  Book.findOne({
    'googleInfo.id': id
  }, function (err, book) {
    if (err) {
      res.status(404).send(payload('info', {
        message: 'book not found'
      }));
    }
    res.status(200).send(payload('book', {
      book
    }));
  });
});

// GET /books/search?q=foo
router.get('/search', (req, res, next) => {
  const q = req.query.q;
  googleBooks.volumeQuery(q).then((volumes) => {
    var bookList = [];

    // loop through the items and make a Book and add it to the bookList
    for (var i = 0; i < volumes.items.length; i++) {
      var hardCodedRating = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
      var nookrInfo = ({
        'date': new Date(),
        // Hardcoded rating
        'rating': hardCodedRating
      });
      var volume = ({
        'nookrInfo': nookrInfo,
        'googleInfo': volumes.items[i]
      });

      var book = new Book(volume);
      bookList.push(book);
    }

    Book.insertMany(bookList, {
      ordered: false
    }).then((result) => {
      res.status(200).send(payload('googleVolumeList', {
        volumes
      }));
    }).catch((err) => {
      if (err.code === '11000') {
        console.log('duplicates...');
        res.status(200).send(payload('googleVolumeList', {
          volumes
        }));
      } else {
        console.error(err);
        // return something here to say that something went wrong.
        res.status(500).send(payload('error', {
          message: err.message
        }));
      }
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
