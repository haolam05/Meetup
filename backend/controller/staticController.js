const path = require('path');

function getHomePage(req, res) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return res.sendFile(path.resolve(__dirname, '../../frontend', this.folder, 'index.html'));
}

module.exports = {
  getHomePage
}
