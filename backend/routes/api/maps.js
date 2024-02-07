const express = require('express');
const router = express.Router();
const mapsController = require('../../controller/mapsController');
const { requireAuth } = require('../../controller/authController');

router.post('/key', requireAuth, mapsController.getMapsAPIKey);

module.exports = router;
