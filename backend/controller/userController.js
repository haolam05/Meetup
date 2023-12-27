const bcrypt = require('bcryptjs');
const { User } = require('../db/models');
const { check } = require('express-validator');
const { setTokenCookie } = require('./authController');
const handleValidationErrors = require('../utils/validation');

function validateSignup() {
  return [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required (minimum of 4 characters)'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password is required (minimum of 6 characters)'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    handleValidationErrors
  ];
}

async function signUp(req, res) {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ email, username, hashedPassword, firstName, lastName });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
  };

  setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
};

module.exports = {
  validateSignup,
  signUp
}
