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
    var rating = {bookID: bookID, rating: ratingNumber};
    var bookFound = false;
    for (var i = 0; i < user.books.length; i++) {
      // If an entry already exists, overwrite it
      if (user.books[i].bookID === bookID){
        bookFound = true;
        user.books[i].rating = ratingNumber;
      }
    }

    // If a previous rating does not exist, push a new one to the user's books
    if (!bookFound){
      user.books.push(rating);
    }

    user.save(function(err) {
      if (err) {
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

  var returnRating = 0;

  User.findById(userID, (err, user) => {
    try{
        for (var i = 0; i < user.books.length; i++) {
        // If an entry exists, return it
        if (user.books[i].bookID === bookID){
          returnRating = user.books[i].rating;
        }
      }
    } catch(err) {
      console.log(err);
    }
    // Return rating
    res.status(200).send(payload('rating', {'bookRating': returnRating}))
  });
});

module.exports = router;