const { Group, GroupImage, Venue, User, Membership } = require('../db/models');
const { check } = require('express-validator');
const { notFoundError, forbiddenError } = require('../utils/makeError');
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
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Venue,
        through: {
          attributes: []
        }
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

async function getGroups(_req, res) {
  const groups = await Group.findAll();
  res.json({ Groups: await _countNumMembersAndGetPreviewURL(groups) });
}

async function getGroupsOrganizedByCurrentUser(req, res) {
  const groupsByCurrentUser = await req.user.getGroups();
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

async function createGroupImage(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  if (group.organizerId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  const newImage = await group.createGroupImage(req.body);
  res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  });
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
  getGroupsOrganizedByCurrentUser,
  createGroupValidation,
  createGroup,
  createGroupImage,
  editGroup,
  deleteGroup
}
