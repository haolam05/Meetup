function notFoundError(message) {
  const err = new Error(message);
  err.status = 404;
  return err;
}

function forbiddenError() {
  const err = new Error("Forbidden");
  err.status = 403;
  return err;
}

module.exports = {
  notFoundError,
  forbiddenError
}
