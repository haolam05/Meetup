const express = require('express');
const router = express.Router();
const groupImageController = require('../../controller/groupImageController');
const { requireAuth } = require('../../controller/authController');

router.delete('/:imageId', requireAuth, groupImageController.deleteGroupImage);

module.exports = router;
