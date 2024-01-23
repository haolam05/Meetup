const express = require('express');
const router = express.Router();
const groupController = require('../../controller/groupController');
const venuesRouter = require('./venues');
const eventsRouter = require('./events');
const groupImagesRouter = require('./groupImages');
const membershipsRouter = require('./memberships');
const eventController = require('../../controller/eventController');
const { requireAuth } = require('../../controller/authController');

router.get('/:groupId/events', eventController.getGroupEvents);
router.get('/current', requireAuth, groupController.getGroupsOrganizedByCurrentUser);

router.use('/:groupId/images', requireAuth, groupImagesRouter);
router.use('/:groupId/venues', requireAuth, venuesRouter);
router.use('/:groupId/events', requireAuth, eventsRouter);
router.use(['/:groupId/members', '/:groupId/membership'], membershipsRouter);

router
  .route('/:groupId')
  .get(groupController.getGroup)
  .put(requireAuth, groupController.createGroupValidation(), groupController.editGroup)
  .delete(requireAuth, groupController.deleteGroup);

router
  .route('/')
  .get(groupController.getGroupsQueryValidation(), groupController.getGroups)
  .post(requireAuth, groupController.createGroupValidation(), groupController.createGroup);

module.exports = router;
