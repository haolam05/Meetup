const express = require('express');
const router = express.Router({ mergeParams: true });
const messageController = require('../../controller/messageController');
const { requireAuth } = require('../../controller/authController');

router.post('/general', requireAuth, messageController.signalNewGeneralMessage);

module.exports = router;
