const express = require('express');
const router = express.Router({ mergeParams: true });
const groupImageController = require('../../controller/groupImageController');
const { requireAuth } = require('../../controller/authController');
const { singleMulterUpload } = require('../../awsS3');

router.post('/', singleMulterUpload("image"), requireAuth, groupImageController.createGroupImage)

router
  .route('/:imageId')
  .put(requireAuth, singleMulterUpload("image"), groupImageController.editGroupImage)
  .delete(requireAuth, groupImageController.deleteGroupImage);

module.exports = router;
