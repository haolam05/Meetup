const { Event, Group } = require('../db/models');
const { notFoundError } = require('../utils/makeError');
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

module.exports = {
  getEventAttendees
}
