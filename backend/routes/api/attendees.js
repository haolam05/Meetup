const express = require('express');
const router = express.Router({ mergeParams: true });
const attendeeController = require('../../controller/attendeeController');
const { requireAuth } = require('../../controller/authController');

router
  .route('/')
  .get(attendeeController.getEventAttendees)
  .post(requireAuth, attendeeController.createEventAttendance);

module.exports = router;
