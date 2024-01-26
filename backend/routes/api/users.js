const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const { singleMulterUpload } = require('../../awsS3');

router.post('/', singleMulterUpload("image"), userController.validateSignup(), userController.signUp);

module.exports = router;
