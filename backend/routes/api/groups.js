const express = require('express');
const router = express.Router();
const groupController = require('../../controller/groupController');
const venuesRouter = require('./venues');
const eventsRouter = require('./events');
const { requireAuth } = require('../../controller/authController');

router.use('/:groupId/events', eventsRouter);
router.use('/:groupId/venues', requireAuth, venuesRouter);
router.get('/current', requireAuth, groupController.getGroupsOrganizedByCurrentUser);
router.post('/:groupId/images', requireAuth, groupController.createGroupImage);

router
  .route('/:groupId')
  .get(groupController.getGroup)
  .put(requireAuth, groupController.createGroupValidation(), groupController.editGroup)
  .delete(requireAuth, groupController.deleteGroup);

router
  .route('/')
  .get(groupController.getGroups)
  .post(requireAuth, groupController.createGroupValidation(), groupController.createGroup);

module.exports = router;
