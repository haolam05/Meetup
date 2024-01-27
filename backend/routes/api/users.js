const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const { singleMulterUpload } = require('../../awsS3');
const { requireAuth } = require('../../controller/authController');

router
  .route('/')
  .post(singleMulterUpload("image"), userController.validateSignup(), userController.signUp)
  .put(requireAuth, singleMulterUpload("image"), userController.validateEdit(), userController.editUser);

module.exports = router;
