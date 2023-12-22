const router = require("express").Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../controller/authController.js");
const { restoreCSRF } = require('../../utils');

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.get("/csrf/restore", restoreCSRF);

module.exports = router;
