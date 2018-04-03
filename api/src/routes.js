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

  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      let status = 200;
      res.status(status).send(info).end();
    })(req, res);
  });

};
