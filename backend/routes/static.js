const express = require('express');
const router = express.Router();
const staticController = require('../controller/staticController');

// Static routes - Serve React build files in production
// Serve the frontend's index.html file at all other routes NOT starting with /api, including the root route /
// Serve the static assets in the frontend's build folder
if (process.env.NODE_ENV === 'development') {
  const path = require('path');

  router.get('/', staticController.getHomePageFromDist);
  router.use(express.static(path.resolve("../../frontend/build")));
  router.get(/^(?!\/?api).*/, staticController.getHomePageFromBuild)
}

module.exports = router;
