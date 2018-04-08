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
const app = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(mongoUrl);
require('./passport')(passport);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

require('./routes.js')(app, passport);

// Handle unauthorized requests here.
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send(payload('unauthorized'));
  }
});

app.listen(port, host);

console.log(`Running on http://${host}:${port}`);