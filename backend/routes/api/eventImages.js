const express = require('express');
const router = express.Router({ mergeParams: true });
const eventImageController = require('../../controller/eventImageController');
const { requireAuth } = require('../../controller/authController');
const { singleMulterUpload } = require('../../awsS3');

router
  .route('/')
  .get(requireAuth, eventImageController.getEventImages)
  .post(singleMulterUpload("image"), requireAuth, eventImageController.createEventImage);

router
  .route('/:imageId')
  .put(requireAuth, singleMulterUpload("image"), eventImageController.editEventImage)
  .delete(requireAuth, eventImageController.deleteEventImage);

module.exports = router;
