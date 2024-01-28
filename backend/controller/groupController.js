const { Group, GroupImage, Venue, User, Membership } = require('../db/models');
const { check, query } = require('express-validator');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const { Op } = require('sequelize');
const handleValidationErrors = require('../utils/validation');

async function getGroup(req, res, next) {
  let group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: GroupImage
      },
      {
        model: User,
        as: 'Organizer',
        attributes: ['id', 'firstName', 'lastName', 'profileImageUrl']
      },
      {
        model: Venue
      }
    ]
  });

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  const numMembers = (await group.getMembers()).length;
  group = { ...group.toJSON(), numMembers };

  res.json(group);
}

function getGroupsQueryValidation() {
  const isString = val => val.split('').every(ch => ' abcdefghijklmnopqrstuvwxyz'.includes(ch.toLowerCase()));

  return [
    query('page')
      .optional({ checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage('Page must be greater than or equal to 1'),
    query('size')
      .optional({ checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage('Size must be greater than or equal to 1'),
    query('name')
      .optional({ checkFalsy: true })
      .custom(val => isString(val))
      .withMessage('Name must be a string'),
    query('type')
      .optional({ checkFalsy: true })
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    query('private')
      .optional({ checkFalsy: true })
      .isIn(['0', '1'])
      .withMessage('Private must be 0 and 1'),
    query('city')
      .optional({ checkFalsy: true })
      .custom(val => isString(val))
      .withMessage('City must be a string'),
    query('state').optional({ checkFalsy: true })
      .custom(val => isString(val))
      .withMessage('State must be a string'),
    handleValidationErrors
  ];
}

async function getGroups(req, res) {
  const page = req.query.page === undefined ? 1 : +req.query.page;
  const size = req.query.size === undefined ? 20 : +req.query.size;
  const query = {
    limit: size,
    offset: (page - 1) * size,
    where: {}
  };

  if (req.query.name) query.where.name = { [Op.like]: `%${req.query.name}%` };
  if (req.query.type) query.where.type = req.query.type;
  if (req.query.private) query.where.private = +req.query.private;
  if (req.query.city) query.where.city = req.query.city;
  if (req.query.state) query.where.state = req.query.state;

  const groups = await Group.findAll(query);
  res.json({ Groups: await _countNumMembersAndGetPreviewURL(groups) });
}

async function getCurrentUserGroups(req, res) {
  const groupsOwnByCurrentUser = await req.user.getGroups();
  const groupsCurrentUserIsMember = await req.user.getMemberships();
  const groupsByCurrentUser = [...groupsOwnByCurrentUser, ...groupsCurrentUserIsMember];
  res.json({ Groups: await _countNumMembersAndGetPreviewURL(groupsByCurrentUser) });
}

function createGroupValidation() {
  return [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 60 })
      .withMessage('Name must be 60 characters or less'),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage('About must be 50 characters or more'),
    check('type')
      .isIn(['In person', 'Online'])
      .withMessage(`Type must be 'Online' or 'In person'`),
    check('private')
      .isIn(['true', 'false'])
      .withMessage('Private must be a boolean'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    handleValidationErrors
  ];
}

async function createGroup(req, res) {
  const newGroup = await req.user.createGroup(req.body);
  res.status(201);
  res.json(newGroup);
}

async function editGroup(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  if (group.organizerId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  const updatedGroup = await group.update(req.body);
  res.json(updatedGroup);
}

async function deleteGroup(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  if (group.organizerId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  await group.destroy();
  res.json({ message: 'Successfully deleted' });
}

async function _countNumMembersAndGetPreviewURL(groups) {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const members = await group.getMembers();
    const previewImages = await group.getGroupImages({ where: { preview: true } });
    const previewImage = previewImages.length ? previewImages[0].url : 'Preview Image Not Found';
    groups[i] = { ...group.toJSON(), numMembers: members.length, previewImage };
  }
  return groups;
}

module.exports = {
  getGroup,
  getGroups,
  getCurrentUserGroups,
  createGroupValidation,
  createGroup,
  editGroup,
  deleteGroup,
  getGroupsQueryValidation
}
