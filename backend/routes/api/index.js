const router = require("express").Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const restoreCSRF = require('../../utils/restoreCSRF');
const { restoreUser } = require("../../controller/authController");

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.get("/csrf/restore", restoreCSRF);

module.exports = router;
