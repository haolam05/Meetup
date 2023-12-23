const express = require('express');
const router = express.Router({ mergeParams: true });
const attendeeController = require('../../controller/attendeeController');

router.get('/', attendeeController.getEventAttendees);

module.exports = router;
