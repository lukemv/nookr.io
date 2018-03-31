#!/usr/bin/env/node
'use strict';
var mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const host = '0.0.0.0';
const env = process.env.Environment || '';
const port = (env == 'prod' ||  env == 'uat' || env == 'docker') ? 80 : 8081;
const mongoUrl = process.env.MongoUrl || 'mongodb://localhost/nookr';
const app = express();

app.use(session({ secret: 'S4Hw2DEsTSsXZEQm4bnc7MNj' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(mongoUrl);
require('./passport')(passport);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./routes.js')(app, passport);

app.listen(port, host);

console.log(`Running on http://${host}:${port}`);