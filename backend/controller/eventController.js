const { Event, Group, Venue } = require('../db/models');
const { notFoundError } = require('../utils/makeError');
const { check, query } = require('express-validator');
const { Op } = require('sequelize');
const handleValidationErrors = require('../utils/validation');
const checkUserRole = require('../utils/userRoleAuthorization');

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

function getEventsQueryValidation() {
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
      .custom(val => val.split('').every(ch => ' abcdefghijklmnopqrstuvwxyz'.includes(ch.toLowerCase())))
      .withMessage('Name must be a string'),
    query('type')
      .optional({ checkFalsy: true })
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    query('startDate')
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .withMessage('Start date must be a valid datetime'),
    handleValidationErrors
  ];
}

async function getEvents(req, res) {
  const page = req.query.page === undefined ? 1 : +req.query.page;
  const size = req.query.size === undefined ? 20 : +req.query.size;
  const query = {
    attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
    limit: size,
    offset: (page - 1) * size,
    where: {}
  };

  if (req.query.name) query.where.name = { [Op.like]: `%${req.query.name}%` };
  if (req.query.type) query.where.type = req.query.type;
  if (req.query.startDate) query.where.startDate = req.query.startDate;

  const events = await Event.findAll(query);

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

function createEventValidation() {
  return [
    check('name')
      .isLength({ min: 5 })
      .withMessage('Name must be at least 5 characters'),
    check('type')
      .isIn(['Online', 'In person'])
      .withMessage("Type must be Online or In person"),
    check('capacity')
      .isInt({ min: 1 })
      .withMessage('Capacity must be an integer'),
    check('price')
      .isFloat({ min: 1 })
      .withMessage('Price is invalid'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('startDate')
      .custom(val => {
        if (new Date(val).getTime() < Date.now()) throw new Error('Start date must be in the future')
        return true
      }),
    check('endDate')
      .custom((val, { req }) => {
        if (new Date(val).getTime() < new Date(req.body.startDate).getTime()) throw new Error('End date is less than start date');
        return true
      }),
    handleValidationErrors
  ];
}

async function createEvent(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);
  const venue = await Venue.findByPk(req.body.venueId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  if (!venue) {
    const err = notFoundError("Venue couldn't be found");
    return next(err);
  }

  const err = await checkUserRole(group, req.user.id);
  if (err) return next(err);

  const newEvent = await Event.create({ ...req.body, groupId: req.params.groupId });

  res.json({
    id: newEvent.id,
    groupId: newEvent.groupId,
    venueId: newEvent.venueId,
    name: newEvent.name,
    type: newEvent.type,
    capacity: newEvent.capacity,
    price: newEvent.price,
    description: newEvent.description,
    startDate: newEvent.startDate,
    endDate: newEvent.endDate
  });
}

async function editEvent(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);
  const venue = await Venue.findByPk(req.body.venueId);

  if (!venue) {
    const err = notFoundError("Venue couldn't be found");
    return next(err);
  }

  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const group = await Group.findByPk(event.groupId);
  const err = await checkUserRole(group, req.user.id);
  if (err) return next(err);

  const updatedEvent = await event.update(req.body, { attributes: { exclude: ['updatedAt'] } });
  res.json(updatedEvent);
}

async function deleteEvent(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const group = await Group.findByPk(event.groupId);
  const err = await checkUserRole(group, req.user.id);
  if (err) return next(err);

  await event.destroy();
  res.json({ message: 'Sucessfully deleted' });
}

module.exports = {
  getGroupEvents,
  getEvents,
  getEvent,
  createEventValidation,
  createEvent,
  editEvent,
  deleteEvent,
  getEventsQueryValidation
}
