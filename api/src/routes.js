const payload = require('./payload');
const config = require('./config');
const jwt = require('express-jwt');
const User = require('./models/user');
const libnook = require('./libnook');
const Book = require('./models/book');

module.exports = function(app, passport, session) {
  // Enforce JWT middleware with whitelisted routes.
  const authWhitelist = {path: ['/health', '/register', '/login', '/addRating', '/googleVolumeSearch', '/singleBook', '/trending', 'myList']};
  const isRevokedCallback = (req, payload, done) => {
    const issuer = payload.iss;
    const userId = payload.cid;
    const jti = payload.jti;
    session.isRevoked(issuer, userId, jti, done);
  }

  app.use(jwt({
    secret: config.jwtSecret,
    isRevoked: isRevokedCallback
  }).unless(authWhitelist));
  // End of JWT middleware

  app.post('/register', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
      let status = 200;

      if (info.messageType === 'signupSuccess') {
        status = 201;
      }

      res.status(status).send(info).end();
    })(req, res);
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      let status = 200;
      res.status(status).send(info).end();
    })(req, res);
  });

  app.get('/logoff', (req, res, next) => {
    const userId = req.user.cid;
    const jti = req.user.jti;
    const issuer = req.user.iss;
    session.revokeToken(issuer, userId, jti, (err, redisResponse) => {
      const errMsg = 'Failed to revoke session token';

      if (err || redisResponse !== 1) {
        return res.status(500).send(payload('error', {
          message: errMsg
        })).end();
      }

      return res.status(204).send(payload('logoffSuccess', {
        message: 'Logoff Successful!'
      })).end();
    });
  });

  app.get('/profile', (req, res, next) => {
    User.findById(req.user.cid, (err, user) => {
      if (err) {
        return res.status(500).send(payload('error', {message: err.toString()}));
      }

      const pl = payload('profile', {
        message: 'ok',
        user: {
          id: user.id.toString(),
          local: {
            // Attach properties that are on the User model here
            // to pass them on to the client.
            email: user.local.email
          }
        }
      });

      return res.status(200).send(pl);
    })
  });

  app.get('/token', (req, res, next) => {
    const userId = req.user.cid;
    const tExp = session.generateToken(userId)

    const pl = payload('refreshToken', {
      message: 'Token refresh successful',
      token: tExp.token,
      expires: tExp.expires
    });

    return res.status(200).send(pl);
  });

  app.get('/health', (req, res, next) => {
    res.status(200).send(payload('health', {
      message: {
        health: 'ok'
      }
    }));
  })
  
  app.get('/trending', (req, res, next) => {
    const date = new Date();
    var bookList = [];
    Book.find({}, function(err, books) {
      if (err) {
        res.status(404).send(payload('info', {message: 'book not found'}));
      }
      
      // Search through each book and return only the ones rated above or equal to 3
      books.forEach(function(book) {
        if (book.nookrInfo.rating >= 3){
          bookList.push(book.googleInfo);
        }
      });
      
      res.status(200).send(payload('book', {bookList}));
    });
  });
  // Gets all Books rated by a user
  app.get('/myList', (req, res, next) => {
    const date = new Date();
    var bookList = [];
    Book.find({}, function(err, books) {
      if (err) {
        res.status(404).send(payload('info', {message: 'book not found'}));
      }
      
      // Search through each book and return only the ones rated above or equal to 3
      books.forEach(function(book) {
        if (book.nookrInfo.rating >= 3){
          bookList.push(book.googleInfo);
        }
      });
      
      res.status(200).send(payload('book', {bookList}));
    });
  });

  app.get('/singleBook', (req, res, next) =>{
    const id = req.query.id;
    Book.findOne({ 'googleInfo.id':  id }, function(err, book) {
      if (err) {
        res.status(404).send(payload('info', {message: 'book not found'}));
      }
      res.status(200).send(payload('book', {book}));
    });
  });


  app.get('/googleVolumeSearch', (req, res, next) => {
    const q = req.query.q;
    libnook.googleVolumeSearch(q).then((volumes) => {

      var bookList = [];
      
      // loop through the items and make a Book and add it to the bookList
      for (var i =0; i < volumes.items.length; i++) {
        var hardCodedRating = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        var nookrInfo =  ({
          'date': new Date(),
          // Hardcoded rating
          'rating': hardCodedRating
        });
        var volume = ({
          'nookrInfo': nookrInfo,
          'googleInfo' : volumes.items[i]
        });

        // Can we do a googleDetailedVolumeSearch and get a single book result that has more details? Something like:
        // googleDetailedVolumeSearch(volume.id).then((detailedVolume) => {
        //  var book = new Book(detailedVolume);
        //  bookList.push(book)
        // })

        var book = new Book(volume);
        bookList.push(book)
      }
    
      Book.insertMany(bookList).then((result) => {
        //console.log(JSON.stringify(volumes.items[0], null, 2));
        res.status(200).send(payload('googleVolumeList', {volumes}));
      }).catch((err) => {
        console.error(err);
        // return something here to say that something went wrong.
        res.status(500).send(payload('error', {message: err.message}));
      })

    });
  });
  // Adds a rating for the Book and User models
  app.get('/addRating', (req, res, next) => {
    const userID = req.query.userID;
    const bookID = req.query.bookID;
    const ratingNumber = req.query.rating;
    console.log('called... user: ' + userID + '  BookID: ' + bookID + '  rating: ' + ratingNumber);
    var user;
    
    User.findById(userID, (err, user) => {
      var rating = {bookID: bookID, rating: ratingNumber};
      user.books.push(rating);
      this.user = user
      user.save(function(err) {
        console.log('Pushing to user: ' + JSON.stringify(rating))
        if (err) {
          console.log(err);
        }
      });
    }).then(
      Book.findOne({ 'googleInfo.id':  bookID },(err, book) => {
        var rating = {userID: userID, rating: ratingNumber};
        book.nookrInfo.ratings.push(rating);
        book.save(function(err) {
          console.log('Pushing to Book: ' + JSON.stringify(rating))
          if (err) {
            console.log(err);
          }
        });
        res.status(200).send(payload('ratings', {'book': book, 'user': this.user}));
      })
    );
  });
};