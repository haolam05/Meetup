function signalNewGeneralMessage(req, res) {
  req.app.io.emit("new_general_message", { message: req.body.message, sender: req.user, at: new Date() });
  res.json();
}

module.exports = {
  signalNewGeneralMessage
}
