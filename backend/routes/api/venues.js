const express = require('express');
const router = express.Router({ mergeParams: true });
const venueController = require('../../controller/venueController');

router.get('/', venueController.getGroupVenues);

module.exports = router;
