#!/usr/bin/env/node
'use strict';
const express = require('express');
const payload = require('./payload');

const host = '0.0.0.0';
const env = process.env.Environment || '';
const port = (env == 'prod' ||  env == 'uat' || env == 'docker') ? 80 : 8080;

const app = express();

app.get('/', (req, res) => {
  const v = payload('infoMessage', {message: "Hello Paul"});
  res.send(v);
});

app.get('/foo', (req, res) => {
  const v = payload('infoMessage', {message: "Hello Paul"});
  res.send(v);
});

app.listen(port, host);

console.log(`Running on http://${host}:${port}`);