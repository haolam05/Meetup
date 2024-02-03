const { check } = require('express-validator');
const { Membership, Attendance, Event, Group, User } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const { Op } = require('sequelize');
const checkUserRole = require('../utils/userRoleAuthorization');
const handleValidationErrors = require('../utils/validation');

async function getGroupMembers(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  let members = await group.getMembers({ attributes: { exclude: ['username'] } });
  members = members.map(m => ({ id: m.id, firstName: m.firstName, lastName: m.lastName, profileImageUrl: m.profileImageUrl, Membership: { status: m.Membership.status } }));
  if (req.user) {
    const notAuthorized = await checkUserRole(group, req.user.id);
    if (notAuthorized) members = members.filter(member => member.Membership.status != 'pending')
  } else {
    members = members.filter(member => member.Membership.status != 'pending')
  }

  res.json({ Members: members });
}

async function createMember(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  const member = await Membership.findOne({
    where: {
      [Op.and]: [
        { userId: req.user.id },
        { groupId: group.id }
      ]
    }
  });

  if (member) {
    const err = new Error();
    err.status = 400;
    err.message = member.status === 'pending' ? 'Membership has already been requested' : 'User is already a member of the group';
    return next(err)
  }

  const newMember = await Membership.create({ userId: req.user.id, groupId: group.id, status: 'pending' });
  res.json({
    memberId: newMember.userId,
    status: newMember.status
  });
}

function updateMemberValidation() {
  return [
    check('status')
      .isIn(['member', 'co-host'])
      .withMessage('Status must be member or co-host'),
    check('status')
      .custom(val => {
        if (val === 'pending') throw new Error('Cannot change a membership status to pending');
        return true;
      }),
    handleValidationErrors
  ];
}

async function updateMember(req, res, next) {
  const user = await User.findByPk(req.body.memberId);
  if (!user) {
    const err = notFoundError("User couldn't be found");
    return next(err);
  }

  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  const membership = await Membership.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { groupId: group.id }
      ]
    }
  });

  if (!membership) {
    const err = notFoundError("Membership between the user and the group does not exist");
    return next(err);
  }

  let updatedMembership;
  if (req.body.status === 'co-host' && group.organizerId === req.user.id) {
    updatedMembership = await membership.update({ status: 'co-host' });
  }
  if (req.body.status === 'member' && membership.status === 'co-host' && group.organizerId === req.user.id) {
    updatedMembership = await membership.update({ status: 'member' });
  }
  if (membership.status === 'pending' && req.body.status === 'member') {
    const notAuthorized = await checkUserRole(group, req.user.id);
    if (notAuthorized === null) updatedMembership = await membership.update({ status: 'member' });
  }

  if (!updatedMembership) {
    const err = forbiddenError();
    return next(err);
  }

  res.json({
    id: updatedMembership.id,
    groupId: updatedMembership.groupId,
    memberId: updatedMembership.userId,
    status: updatedMembership.status
  });
}

async function deleteMember(req, res, next) {
  const user = await User.findByPk(req.params.memberId);
  if (!user) {
    const err = notFoundError("User couldn't be found");
    return next(err);
  }

  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  const membership = await Membership.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { groupId: group.id }
      ]
    }
  });
  if (!membership) {
    const err = notFoundError("Membership does not exist for this User");
    return next(err);
  }

  if (group.organizerId !== req.user.id && req.user.id !== user.id) {
    const err = forbiddenError();
    return next(err);
  }

  const events = await Event.findAll({ where: { groupId: group.id } });
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const attendance = await Attendance.findOne({
      where: {
        [Op.and]: [
          { eventId: event.id },
          { userId: user.id }
        ]
      }
    });
    if (attendance) await attendance.destroy();
  }

  await membership.destroy();
  res.json({ message: 'Successfully deleted membership from the group' });
}

module.exports = {
  getGroupMembers,
  createMember,
  updateMemberValidation,
  updateMember,
  deleteMember
}
