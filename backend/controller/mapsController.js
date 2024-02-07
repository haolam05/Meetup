const { googleMapsAPIKey } = require('../config');

function getMapsAPIKey(_req, res) {
  res.json({ googleMapsAPIKey });
}

module.exports = {
  getMapsAPIKey
}
