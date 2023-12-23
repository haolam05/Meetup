const express = require('express');
const router = express.Router({ mergeParams: true });
const eventController = require('../../controller/eventController');
const eventImagesRouter = require('./eventImages');
const { requireAuth } = require('../../controller/authController');

router
  .route('/')
  .get(eventController.getEvents)
  .post(eventController.createEventValidation(), eventController.createEvent);

router
  .route('/:eventId')
  .get(eventController.getEvent)
  .put(requireAuth, eventController.createEventValidation(), eventController.editEvent)
  .delete(requireAuth, eventController.deleteEvent);

router.use('/:eventId/images', eventImagesRouter);

module.exports = router;
