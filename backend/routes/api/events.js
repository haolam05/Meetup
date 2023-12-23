const express = require('express');
const router = express.Router({ mergeParams: true });
const eventController = require('../../controller/eventController');

router
  .route('/')
  .get(eventController.getEvents)
  .post(eventController.createEventValidation(), eventController.createEvent);

router.get('/:eventId', eventController.getEvent);

module.exports = router;
