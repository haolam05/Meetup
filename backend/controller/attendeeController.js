const { Attendance, Event, Group, User, Membership } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const checkUserRole = require('../utils/userRoleAuthorization');
const handleValidationErrors = require('../utils/validation');

async function getEventAttendees(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  let events = await event.getUsers();
  events = events.map(e => ({ id: e.id, firstName: e.firstName, lastName: e.lastName, Attendance: { status: e.Attendance.status } }));
  if (req.user) {
    const group = await Group.findByPk(event.groupId);
    const notAuthorized = await checkUserRole(group, req.user.id);
    if (notAuthorized) events = events.filter(event => event.Attendance.status != 'pending');
  } else {
    events = events.filter(event => event.Attendance.status != 'pending');
  }

  res.json({ Attendees: events });
}

async function createEventAttendance(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const isMember = await Membership.findOne({
    where: {
      [Op.and]: [
        { groupId: event.groupId },
        { userId: req.user.id },
        { status: ['co-host', 'member'] }
      ]
    }
  });
  if (!isMember) {
    const err = forbiddenError();
    return next(err);
  }

  const attendance = await Attendance.findOne({
    where: {
      [Op.and]: [
        { userId: req.user.id },
        { eventId: event.id }
      ]
    }
  });
  if (attendance) {
    const err = new Error();
    err.status = 400;
    err.message = attendance.status === 'pending' ? 'Attendance has already been requested' : 'User is already an antendee of the event';
    return next(err);
  }

  const newAttendee = await Attendance.create({ eventId: event.id, userId: req.user.id, status: 'pending' });

  res.json({
    userId: newAttendee.userId,
    status: newAttendee.status
  });
}

function updateAttendanceValidation() {
  return [
    check('status')
      .isIn(['attending', 'waitlist'])
      .withMessage('Status must be attending or waitlist'),
    check('status')
      .custom(val => {
        if (val === 'pending') throw new Error('Cannot change an attendance status to pending');
        return true;
      }),
    handleValidationErrors
  ];
}

async function updateEventAttendance(req, res, next) {
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    const err = notFoundError("User couldn't be found");
    return next(err);
  }

  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const attendance = await Attendance.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { eventId: event.id }
      ]
    }
  });
  if (!attendance) {
    const err = notFoundError("Attendance between the user and the event does not exist");
    return next(err);
  }

  const group = await Group.findByPk(event.groupId);
  const err = await checkUserRole(group, req.user.id);
  if (err) return next(err);

  const updatedAttendance = await attendance.update({ status: req.body.status });
  res.json({
    id: updatedAttendance.id,
    eventId: updatedAttendance.eventId,
    userId: updatedAttendance.userId,
    status: updatedAttendance.status
  });
}

async function deleteAttendance(req, res, next) {
  const user = await User.findByPk(req.params.userId);
  if (!user) {
    const err = notFoundError("User couldn't be found");
    return next(err);
  }

  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const attendance = await Attendance.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { eventId: event.id }
      ]
    }
  });
  if (!attendance) {
    const err = notFoundError("Attendance does not exist for this User");
    return next(err);
  }

  const group = await Group.findByPk(event.groupId);
  if (group.organizerId !== req.user.id && req.user.id !== user.id) {
    const err = forbiddenError();
    return next(err);
  }

  await attendance.destroy();
  res.json({ message: 'Successfully deleted attendance from event' });
}

module.exports = {
  getEventAttendees,
  createEventAttendance,
  updateAttendanceValidation,
  updateEventAttendance,
  deleteAttendance
}
