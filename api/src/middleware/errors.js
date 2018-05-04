const payload = require('../models/payload');
// Notice that methods in this file have 4 arguments
// expressJS treats these as error handlers when added
// as middleware
module.exports = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send(payload('unauthorized'));
  }
};
