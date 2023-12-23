const express = require('express');
const router = express.Router({ mergeParams: true });
const membershipController = require('../../controller/membershipController');
const { requireAuth } = require('../../controller/authController');

router
  .route('/')
  .get(membershipController.getGroupMembers)
  .post(requireAuth, membershipController.createMember);

module.exports = router;
