const express = require('express');
const router = express.Router({ mergeParams: true });
const eventImageController = require('../../controller/eventImageController');
const { requireAuth } = require('../../controller/authController');

router.post('/', requireAuth, eventImageController.createEventImage);

router
  .route('/:imageId')
  .put(requireAuth, eventImageController.editEventImage)
  .delete(requireAuth, eventImageController.deleteEventImage);

module.exports = router;
