const express = require('express');
const router = express.Router({ mergeParams: true });
const groupImageController = require('../../controller/groupImageController');
const { requireAuth } = require('../../controller/authController');

router.post('/', requireAuth, groupImageController.createGroupImage)

router
  .route('/:imageId')
  .put(requireAuth, groupImageController.editGroupImage)
  .delete(requireAuth, groupImageController.deleteGroupImage);

module.exports = router;
