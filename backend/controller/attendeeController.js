const { Attendance, Event, Group } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const { Op } = require('sequelize');
const checkUserRole = require('../utils/userRoleAuthorization');

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

  const group = await Group.findByPk(event.groupId);
  const isMember = await group.getMembers({ where: { id: req.user.id } });
  if (!isMember.length) {
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

module.exports = {
  getEventAttendees,
  createEventAttendance
}
