const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

router.use('/api', apiRouter);

// Static routes
// Serve React build files in production
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api, including the root route /
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
  });
}

module.exports = router;
