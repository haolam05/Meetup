const express = require('express');
const router = express.Router({ mergeParams: true });
const membershipController = require('../../controller/membershipController');

router.get('/', membershipController.getGroupMembers);

module.exports = router;
