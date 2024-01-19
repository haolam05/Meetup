const express = require('express');
const router = express.Router();
const staticController = require('../controller/staticController');

// Static routes - Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');

  // Serve the frontend's index.html file at the root route
  router.get('/', staticController.getHomePage);

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/dist")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, staticController.getHomePage);
}

module.exports = router;
