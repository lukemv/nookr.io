#!/usr/bin/env/node
'use strict';
var mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const payload = require('./payload');

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

const session = require('./session')(redisOptions);
require('./passport')(passport, session);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

require('./routes.js')(app, passport, session);

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