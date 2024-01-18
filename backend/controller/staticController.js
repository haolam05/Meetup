function getHomePageFromDist(req, res) {
  return _getHomePage(req, res, 'dist');
}

function getHomePageFromBuild(req, res) {
  return _getHomePage(req, res, 'build');
}

function _getHomePage(req, res, folder) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return res.sendFile(path.resolve(__dirname, '../../frontend', folder, 'index.html'));
}

module.exports = {
  getHomePageFromDist,
  getHomePageFromBuild
}
