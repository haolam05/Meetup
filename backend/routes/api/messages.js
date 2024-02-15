const express = require('express');
const router = express.Router({ mergeParams: true });
const messageController = require('../../controller/messageController');
const { requireAuth } = require('../../controller/authController');

router.post('/general', requireAuth, messageController.signalNewGeneralMessage);
router.post('/message-react', requireAuth, messageController.signalReactToMessage);
router.get('/message-icons', requireAuth, messageController.fetchEmojis);

module.exports = router;
