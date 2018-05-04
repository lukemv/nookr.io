const express = require('express');
const router = express.Router();
const User = require('../models/user');

const payload = require('../models/payload');

// POST /rating
router.post('/', (req, res, next) => {
  const userID = req.user.cid;
  const bookID = req.body.bookID;
  const ratingNumber = req.body.rating;

  User.findById(userID, (err, user) => {
    if (err) {
      res.status(200).send(payload('rating', {
        message: 'Failed to find user for rating with ID: ' + userID
      }));
      console.log(err);
    }

    const rating = {bookID: bookID, rating: ratingNumber};
    let bookFound = false;
    for (let i = 0; i < user.books.length; i++) {
      // If an entry already exists, overwrite it
      if (user.books[i].bookID === bookID) {
        bookFound = true;
        user.books[i].rating = ratingNumber;
      }
    }

    // If a previous rating does not exist, push a new one to the user's books
    if (!bookFound) {
      user.books.push(rating);
    }

    user.save((err) => {
      if (err) {
        res.status(200).send(payload('rating', {
          message: 'Failed to save user rating' + userID
        }));
        console.log(err);
      }
      // Return the new rating
      res.status(200).send(payload('rating', {'bookRating': ratingNumber}));
    });
  });
});

// GET /rating?bookID=foo
router.get('/', (req, res, next) => {
  const userID = req.user.cid;
  const bookID = req.query.bookID;

  User.findById(userID, (err, user) => {
    if (err) {
      res.status(200).send(payload('rating', {
        message: 'Failed to find user for rating with ID: ' + userID
      }));
      console.log(err);
    }

    for (var i = 0; i < user.books.length; i++) {
      if (user.books[i].bookID === bookID) {
        res.status(200).send(payload('rating', {'bookRating': user.books[i].rating}));
      }
    }

    res.status(200).send(payload('rating', {'bookRating': 0}));
  });
});

module.exports = router;
