const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie } = require('./authController');
const { User } = require('../db/models');
const { check } = require('express-validator');
const handleValidationErrors = require('../utils/validation');

function validateLogin() {
  return [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Email or username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
    handleValidationErrors
  ];
}

async function login(req, res, next) {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    return next(err);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl
  };

  setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
}

function logout(_req, res) {
  res.clearCookie('token');
  return res.json({
    message: 'success'
  });
}

function restoreSession(req, res) {
  const { user } = req;

  if (!user) {
    return res.json({ user: null });
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl
  };

  return res.json({
    user: safeUser
  });
}

module.exports = {
  validateLogin,
  login,
  logout,
  restoreSession
};
