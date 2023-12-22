const express = require('express');
const router = express.Router();
const groupController = require('../../controller/groupController');
const { requireAuth } = require('../../controller/authController');

router.get('/current', requireAuth, groupController.getGroupsOrganizedByCurrentUser);
router.get('/:groupId', groupController.getGroup);

router
  .route('/')
  .get(groupController.getGroups)
  .post(requireAuth, groupController.createGroupValidation(), groupController.createGroup);


module.exports = router;
