const bcrypt = require('bcryptjs');
const { User } = require('../db/models');
const { check } = require('express-validator');
const { setTokenCookie } = require('./authController');
const { singleFileUpload } = require('../awsS3');
const { Op } = require('sequelize');
const { forbiddenError, authenticateError } = require('../utils/makeError');
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
  const profileImageUrl = req.file ? await singleFileUpload({ file: req.file, public: true }) : null;
  const user = await User.create({ email, username, hashedPassword, firstName, lastName, profileImageUrl });

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
};

async function editUser(req, res, next) {
  const { email, username, firstName, lastName, password } = req.body;
  const user = await User.findOne({
    attributes: {
      include: ['hashedPassword']
    },
    where: {
      [Op.and]: [
        { id: req.user.id },
        { email },
        { username }
      ]
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = authenticateError('Invalid credentials');
    return next(err);
  }

  let profileImageUrl
  if (req.file) profileImageUrl = await singleFileUpload({ file: req.file, public: true });
  const updatedUser = await user.update({ firstName, lastName, profileImageUrl: profileImageUrl });

  return res.json({
    user: {
      id: updatedUser.id,
      email,
      username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profileImageUrl: updatedUser.profileImageUrl
    }
  });
}

async function deleteUser(req, res, next) {
  const { userId } = req.params;

  if (+userId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  const user = await User.findByPk(userId);
  if (!user) {
    const err = authenticateError('Invalid credentials');
    return next(err);
  }

  await user.destroy();
  res.clearCookie('token');

  return res.json({
    message: "Successully deleted"
  });
}

module.exports = {
  validateSignup,
  signUp,
  editUser,
  deleteUser
}
