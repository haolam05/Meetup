const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const isProduction = environment === 'production';
const app = express();
const routes = require('./routes');
const { ValidationError } = require('sequelize');

// Log information about request/response
app.use(morgan('dev'));

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Security Middleware (enable cors only in development)
if (!isProduction) app.use(cors());

// helmet helps set a variety of headers to better secure our app
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Set the _csrf token and create req.csrfToken method
app.use(csurf({ cookie: { secure: isProduction, sameSite: isProduction && "Lax", httpOnly: true } }));

// Connect all routes
app.use(routes);

// Handle invalid routes
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Handle Sequelize errors
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;
