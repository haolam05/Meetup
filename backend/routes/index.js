const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const staticRouter = require('./static');

router.use('/api', apiRouter);
router.use(staticRouter);

module.exports = router;
