const express = require('express');
const router = express.Router();
const groupController = require('../../controller/groupController');

router
  .route('/')
  .get(groupController.getAllGroups);


module.exports = router;
