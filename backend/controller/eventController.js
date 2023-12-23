const { Event, Group, Venue } = require('../db/models');
const { notFoundError } = require('../utils/makeError');

async function getGroupEvents(req, res, next) {
  const group = await Group.findByPk(req.params.groupId, {
    attributes: ['id', 'name', 'city', 'state']
  });

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  const events = await Event.findAll({
    attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
    where: {
      groupId: group.id
    }
  });

  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    const venue = await Venue.findByPk(event.venueId, { attributes: ['id', 'city', 'state'] });
    const numAttending = (await event.getUsers()).length;
    const previewImages = await event.getEventImages({ where: { preview: true } });
    const previewImage = previewImages.length ? previewImages[0].url : 'Preview Image Not Found';
    events[i] = { ...event.toJSON(), numAttending, previewImage, Group: group, Venue: venue || null };
  };

  res.json({ Events: events });
}

async function getEvents(_req, res) {
  const events = await Event.findAll({
    attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
  });

  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    const numAttending = (await event.getUsers()).length;
    const previewImages = await event.getEventImages({ where: { preview: true } });
    const previewImage = previewImages.length ? previewImages[0].url : 'Preview Image Not Found';
    const group = await Group.findByPk(event.groupId, { attributes: ['id', 'name', 'city', 'state'] });
    const venue = await Venue.findByPk(event.venueId, { attributes: ['id', 'city', 'state'] });
    events[i] = { ...event.toJSON(), numAttending, previewImage, Group: group, Venue: venue || null };
  }

  res.json({ Events: events });
}

async function getEvent(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const numAttending = (await event.getUsers()).length;
  const group = await Group.findByPk(event.groupId, { attributes: ['id', 'name', 'private', 'city', 'state'] });
  const venue = await Venue.findByPk(event.venueId, { attributes: { exclude: ['groupId'] } });
  const images = await event.getEventImages({ attributes: ['id', 'url', 'preview'] });

  res.json({ ...event.toJSON(), numAttending, Group: group, Venue: venue, EventImages: images });
}

module.exports = {
  getGroupEvents,
  getEvents,
  getEvent
}
