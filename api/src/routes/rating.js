const express = require('express');
const router = express.Router();
const User = require('../models/user');
const recommender = require('../services/recommender');

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

      // console.log(raccoon.config); // doesn't seem to use this config.. ¯\_(ツ)_/¯

      // This is soo dodgy..
      if (ratingNumber >= 3) {
        recommender.liked(userID, bookID).then(() => {
          return res.status(200).send(payload('rating', {'bookRating': ratingNumber}));
        });
      } else {
        recommender.disliked(userID, bookID).then(() => {
          return res.status(200).send(payload('rating', {'bookRating': ratingNumber}));
        });
      }
    });
  });
});

// GET /rating?bookID=foo
router.get('/', (req, res, next) => {
  const userID = req.user.cid;
  const bookID = req.query.bookID;

  User.findById(userID, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(200).send(payload('rating', {
        message: 'Failed to find user for rating with ID: ' + userID
      }));
    }

    for (var i = 0; i < user.books.length; i++) {
      if (user.books[i].bookID === bookID) {
        return res.status(200).send(payload('rating', {'bookRating': user.books[i].rating}));
      }
    }

    return res.status(200).send(payload('rating', {'bookRating': 0}));
  });
});

module.exports = router;
