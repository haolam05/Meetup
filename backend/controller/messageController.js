function signalNewGeneralMessage(req, res, next) {
  req.app.io.emit("new_general_message", { message: req.body.message, at: new Date() });
  res.json();
}

module.exports = {
  signalNewGeneralMessage
}
