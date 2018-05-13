const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const log = require('../services/logger');
const payload = require('../models/payload');

router.post('/', (req, res, next) => {
  const book = req.body.bookX;
  var hardCodedRating = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
  var nookrInfo =  ({
    'date': new Date(),
    // Hardcoded rating
    'rating': hardCodedRating
  });
  var volume = ({
    'nookrInfo': nookrInfo,
    'googleInfo': book
  });
  var tome = new Book(volume);
  Book.create(tome).catch((err) => {
    if (err) {
      console.log(err.errmsg);
    } else {
      console.log('success...');
    }
  });
});

module.exports = router;