const { Event, Group } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const checkUserRole = require('../utils/userRoleAuthorization');

async function createEventImage(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const group = await Group.findByPk(event.groupId);
  const err = await checkUserRole(group, req.user.id);                      // organizer(host), co-host
  const attendees = await event.getUsers({ where: { id: req.user.id } });   // attendee
  if (!attendees.length && err) {
    const err = forbiddenError();
    return next(err);
  }

  const newEventImage = await event.createEventImage(req.body);
  res.json({
    id: newEventImage.id,
    url: newEventImage.url,
    preview: newEventImage.preview
  });
}

module.exports = {
  createEventImage
}
