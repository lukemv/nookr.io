#!/usr/bin/env/node
'use strict';
var mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const host = '0.0.0.0';
const env = process.env.Environment || '';
const port = (env === 'prod' || env === 'uat' || env === 'docker') ? 80 : 8081;

process.env.MongoUrl = process.env.MongoUrl || 'mongodb://localhost/nookr';
process.env.RedisHost = process.env.RedisHost || 'localhost';
process.env.RedisPort = process.env.RedisPort || 6379;

const app = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(process.env.MongoUrl);

const redisOptions = {
  host: process.env.RedisHost,
  port: process.env.RedisPort
};

// Use this single instance redis client where possible
const redisClient = require('./services/redisClient')(redisOptions);

const session = require('./services/session')(redisClient);
require('./services/passport')(passport, session);

// Start Middleware (Called First)
const tokenHandler = require('./middleware/token');
const authWhitelist = {
  path: [
    '/health',
    '/auth/register',
    '/auth/login'
  ]
};
app.use(tokenHandler(session).unless(authWhitelist));

const corsHandler = require('./middleware/cors');
app.use(corsHandler);
// End Middleware (Called First)

// Begin Routes (Called Second)
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');
const ratingRouter = require('./routes/rating');
app.use('/books', booksRouter);
app.use('/health', healthRouter);
app.use('/auth', authRouter(passport, session));
app.use('/rating', ratingRouter);
// End Routes (Called Second)

// Start Middleware (Called Last)
const errorHandler = require('./middleware/errors');
app.use(errorHandler);
// End Middleware (Called Last)

app.listen(port, host);
console.log(`Running on http://${host}:${port}`);
