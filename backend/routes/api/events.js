const express = require('express');
const router = express.Router({ mergeParams: true });
const eventController = require('../../controller/eventController');

router.get('/', eventController.getEvents);
router.get('/:eventId', eventController.getEvent);

module.exports = router;
