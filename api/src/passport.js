var LocalStrategy = require('passport-local').Strategy;
var payload = require('./payload');
var User = require('./models/user');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, done);
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({ 'local.email' :  email }, (err, user) => {
        if (err)
          return done(err);

        if (user) {
          return done(null, false, payload('signupFailed', {
            message: `Error: '${email}' is already in use.`
          }));
        } else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;

            return done(null, newUser, payload('signupSuccess', {
              message: 'Account created'
            }));
          });
        }
      });
    });
  }));
};
