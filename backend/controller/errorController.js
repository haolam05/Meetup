const { ValidationError } = require('sequelize');

module.exports = (err, _req, res, _next) => {
  if (err instanceof ValidationError) _handleValidationErrors(err);

  res.status(err.status || 500);
  console.error(err);

  const responseError = {};

  if (err.title) responseError.title = err.title;
  if (err.message) responseError.message = err.message;
  if (err.errors) responseError.errors = err.errors;
  if (err.stack && this.isProduction) responseError.stack = err.stack;

  res.json(responseError);
};

function _handleValidationErrors(err) {
  let errors = {};
  for (let error of err.errors) {
    errors[error.path] = error.message;
  }
  err.errors = errors;
  _setValidationErrorMessage(err);
}

function _setValidationErrorMessage(err) {
  const errKeys = Object.keys(err.errors);
  if (errKeys.includes('username') || errKeys.includes('email')) {
    err.message = 'User already exists';
  }
}
