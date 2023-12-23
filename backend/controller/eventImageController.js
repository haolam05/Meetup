const { Event, Group, EventImage } = require('../db/models');
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

async function deleteEventImage(req, res, next) {
  const eventImage = await EventImage.findByPk(req.params.imageId);
  if (!eventImage) {
    const err = notFoundError("Event Image couldn't be found");
    return next(err);
  }

  const event = await eventImage.getEvent();
  const group = await Group.findByPk(event.groupId);
  const err = await checkUserRole(group, req.user.id);
  if (err) return next(err);

  await eventImage.destroy();
  res.json({ message: 'Successfully deleted' });
}

module.exports = {
  createEventImage,
  deleteEventImage
}
