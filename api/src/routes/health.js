const express = require('express');
const router = express.Router();

const payload = require('../models/payload');

// GET /health
router.get('/', (req, res, next) => {
  res.status(200).send(payload('health', {
    message: {
      health: 'ok'
    }
  }));
});

module.exports = router;