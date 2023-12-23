const express = require('express');
const router = express.Router({ mergeParams: true });
const eventImageController = require('../../controller/eventImageController');
const { requireAuth } = require('../../controller/authController');

router.post('/', requireAuth, eventImageController.createEventImage);

module.exports = router;
