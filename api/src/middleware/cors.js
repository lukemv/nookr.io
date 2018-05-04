// Cors middleward adds headers to response required
// for browsers to make CORS requests.
module.exports = (req, res, next) => {
  const allowedHeaders = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', allowedHeaders);
  next();
};
