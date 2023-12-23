const express = require('express');
const router = express.Router({ mergeParams: true });
const eventController = require('../../controller/eventController');
const eventImagesRouter = require('./eventImages');

router
  .route('/')
  .get(eventController.getEvents)
  .post(eventController.createEventValidation(), eventController.createEvent);

router.get('/:eventId', eventController.getEvent);

router.use('/:eventId/images', eventImagesRouter);

module.exports = router;
