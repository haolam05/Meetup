const express = require('express');
const router = express.Router({ mergeParams: true });
const venueController = require('../../controller/venueController');

router
  .route('/')
  .get(venueController.getGroupVenues)
  .post(venueController.validateCreateVenue(), venueController.createGroupVenue);

module.exports = router;
