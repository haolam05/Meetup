const { Event, EventImage, Attendance } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');

async function createEventImage(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const attendees = await event.getUsers({ where: { id: req.user.id } });
  if (!attendees.length) {
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
