const LocalStrategy = require('passport-local').Strategy;

const payload = require('../models/payload');
const User = require('../models/user');

module.exports = (passport, session) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, done);
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({'local.email': email}, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false, payload('signupFailed', {
            message: `Register Failed: '${email}' is already in use.`
          }));
        } else {
          user = new User();
          user.local.email = email;
          user.local.password = user.generateHash(password);

          user.save((err) => {
            if (err) {
              throw err;
            }

            const userModel = {
              id: user.id.toString(),
              local: {
                // Attach properties that are on the User model here
                // to pass them on to the client.
                email: user.local.email
              }
            };

            const tExp = session.generateToken(user._id);
            return done(null, user, payload('signupSuccess', {
              message: 'Register Success!',
              token: tExp.token,
              expires: tExp.expires,
              user: userModel
            }));
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({'local.email': email}, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, payload('loginFailed', {
          message: `Login Failed: '${email}' not found`
        }));
      }

      if (!user.validPassword(password)) {
        return done(null, false, payload('loginFailed', {
          message: `Login Failed: invalid password`
        }));
      }

      const tExp = session.generateToken(user._id);

      const userModel = {
        id: user.id.toString(),
        local: {
          // Attach properties that are on the User model here
          // to pass them on to the client.
          email: user.local.email
        }
      };

      return done(null, user, payload('loginSuccess', {
        message: `Login Success!`,
        token: tExp.token,
        expires: tExp.expires,
        user: userModel
      }));
    });
  }));
};
