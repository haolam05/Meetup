const express = require('express');
const router = express.Router();
const sessionController = require('../../controller/sessionController');

router
  .route('/')
  .post(sessionController.validateLogin(), sessionController.login)
  .delete(sessionController.logout)
  .get(sessionController.restoreSession);

module.exports = router;
