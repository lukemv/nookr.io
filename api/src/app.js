#!/usr/bin/env/node
'use strict';
var mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

const config = require('./services/config');
const payload = require('./models/payload');

const host = '0.0.0.0';
const env = process.env.Environment || '';
const port = (env == 'prod' ||  env == 'uat' || env == 'docker') ? 80 : 8081;
const mongoUrl = process.env.MongoUrl || 'mongodb://localhost/nookr';
const redisHost = process.env.RedisHost || 'localhost';
const redisPort = process.env.RedisPort || 6379;

const app = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(mongoUrl);

const redisOptions = {
  host: redisHost,
  port: redisPort
};

const session = require('./services/session')(redisOptions);
require('./services/passport')(passport, session);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Enforce JWT middleware with whitelisted routes.
const authWhitelist = {
  path: [
    '/auth/health',
    '/auth/register',
    '/auth/login',
  ]
};

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

// Routes Begin
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');
const ratingRouter = require('./routes/rating');
app.use('/books', booksRouter);
app.use('/health', healthRouter);
app.use('/auth', authRouter(passport, session));
app.use('/rating', ratingRouter);
// Routes End


// Handle unauthorized requests here.
// It's important that method's with
// 4 arguments come after the others.
// This is what identifies them as error handlers
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send(payload('unauthorized'));
  }
});

app.listen(port, host);
console.log(`Running on http://${host}:${port}`);