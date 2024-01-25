const express = require('express');
const router = express.Router({ mergeParams: true });
const eventController = require('../../controller/eventController');
const eventImagesRouter = require('./eventImages');
const attendeesRouter = require('./attendees');
const { requireAuth } = require('../../controller/authController');

router.get('/current', requireAuth, eventController.getCurrentUserEvents);

router
  .route('/')
  .get(eventController.getEventsQueryValidation(), eventController.getEvents)
  .post(eventController.createEventValidation(), eventController.createEvent);

router
  .route('/:eventId')
  .get(eventController.getEvent)
  .put(requireAuth, eventController.createEventValidation(), eventController.editEvent)
  .delete(requireAuth, eventController.deleteEvent);

router.use('/:eventId/images', eventImagesRouter);
router.use(['/:eventId/attendees', '/:eventId/attendance'], attendeesRouter);

module.exports = router;
