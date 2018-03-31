const payload = require('./payload');


module.exports = function(app, passport) {

  app.get('/', function(req, res) {
      const v = payload('info', {message: "default path"});
      res.send(v);
  });

  app.post('/register', (req, res, next) => {
      passport.authenticate('local-signup', (err, user, info) => {
        let status = 200;

        if (info.messageType === 'signupSuccess') {
          status = 201;
        }

        res.status(status).send(info).end();
      })(req, res);
  });

  app.post('/login', passport.authenticate('local'),
    (req, res) => {
      const v = payload('infoMessage', {
        message: 'login successful'
      });
      res.send(v);
    });

  app.get('/profile', isLoggedIn, function(req, res) {
      const v = payload('profile', {
        user: req.user
      });
      res.send(v);
  });

  app.get('/logout', function(req, res) {
      req.logout();
      const v = payload('infoMessage', {
        message: 'logout successful'
      });
      res.send(v);
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
