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

module.exports = app;
