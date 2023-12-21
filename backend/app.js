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
const globalErrorHandler = require('./controller/errorController');

// Log information about request/response
app.use(morgan('dev'));

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Security Middleware (enable cors only in development)
if (!isProduction) {
  app.use(cors());
}

// helmet helps set a variety of headers to better secure our app
app.use(
  helmet.crossOriginResourcePolicy(
    { policy: "cross-origin" }
  )
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

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

// Handle All Errors
app.use(globalErrorHandler.bind(isProduction));

module.exports = app;
