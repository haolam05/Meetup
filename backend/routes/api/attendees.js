const express = require('express');
const router = express.Router({ mergeParams: true });
const attendeeController = require('../../controller/attendeeController');
const { requireAuth } = require('../../controller/authController');

router
  .route('/')
  .get(attendeeController.getEventAttendees)
  .post(requireAuth, attendeeController.createEventAttendance)
  .put(requireAuth, attendeeController.updateAttendanceValidation(), attendeeController.updateEventAttendance);

module.exports = router;
