const ObjectId = require('mongodb').ObjectID;

const LocalStrategy = require('passport-local').Strategy;

const payload = require('./payload');
const User = require('./models/user');
const session = require('./session');

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
            message: `Register Failed: '${email}' is already in use.`
          }));
        } else {
          var user = new User();
          user.local.email = email;
          user.local.password = user.generateHash(password);

          user.save(function(err) {
            if (err)
              throw err;

            const token = session.generateToken(user);
            return done(null, user, payload('signupSuccess', {
              message: 'Register Success!',
              token: token
            }));
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {
    User.findOne({ 'local.email' :  email }, function(err, user) {
      if (err)
        return done(err);

      if (!user)
        return done(null, false, payload('loginFailed', {
          message: `Login Failed: '${email}' not found`
        }));

      if (!user.validPassword(password))
        return done(null, false, payload('loginFailed', {
          message: `Login Failed: invalid password`
        }));

      const token = session.generateToken(user);

      return done(null, user, payload('loginSuccess', {
        message: `Login Success!`,
        token: token
      }));
    });
  }));
};
