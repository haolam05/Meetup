const router = require("express").Router();
const sessionRouter = require('./session');
const usersRouter = require('./users');
const groupsRouter = require('./groups');
const restoreCSRF = require('../../utils/restoreCSRF');
const { restoreUser } = require("../../controller/authController");

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.get("/csrf/restore", restoreCSRF);

module.exports = router;
