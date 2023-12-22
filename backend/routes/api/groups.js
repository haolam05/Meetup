const express = require('express');
const router = express.Router();
const groupController = require('../../controller/groupController');
const { requireAuth } = require('../../controller/authController');

router.get('/current', requireAuth, groupController.getAllGroupsOrganizedByCurrentUser);

router
  .route('/')
  .get(groupController.getAllGroups);


module.exports = router;
