#!/usr/bin/env/node
'use strict';
const express = require('express');
const payload = require('./payload');

const host = '0.0.0.0';
const env = process.env.Environment || '';
const port = (env == 'prod' ||  env == 'uat' || env == 'docker') ? 80 : 8081;

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  const v = payload('infoMessage', {message: "hello nookr.io"});
  res.send(v);
});

app.listen(port, host);

console.log(`Running on http://${host}:${port}`);