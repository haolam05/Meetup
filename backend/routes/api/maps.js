const express = require('express');
const router = express.Router();
const { googleMapsAPIKey } = require('../../config');
console.log(googleMapsAPIKey);

router.post('/key', (_req, res) => {
  res.json({ googleMapsAPIKey });
});

module.exports = router;
