const express = require('express');
const router = express.Router({ mergeParams: true });
const venueController = require('../../controller/venueController');
const { requireAuth } = require('../../controller/authController');

router.put('/:venueId', requireAuth, venueController.validateCreateVenue(), venueController.editVenue);

router
  .route('/')
  .get(venueController.getGroupVenues)
  .post(venueController.validateCreateVenue(), venueController.createGroupVenue);

module.exports = router;
