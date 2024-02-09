const express = require('express');
const router = express.Router({ mergeParams: true });
const venueController = require('../../controller/venueController');
const { requireAuth } = require('../../controller/authController');

router
  .route('/:venueId')
  .put(requireAuth, venueController.validateCreateVenue(), venueController.editVenue)
  .delete(requireAuth, venueController.deleteVenue);

router
  .route('/')
  .get(venueController.getGroupVenues)
  .post(venueController.validateCreateVenue(), venueController.createGroupVenue);

module.exports = router;
