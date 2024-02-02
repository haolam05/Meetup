const { Op } = require('sequelize');
const { Event, Group, EventImage, Attendance } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const { singleFileUpload } = require('../awsS3');
const checkUserRole = require('../utils/userRoleAuthorization');

async function createEventImage(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const group = await Group.findByPk(event.groupId);
  const err = await checkUserRole(group, req.user.id);
  const attendee = await Attendance.findOne({
    where: {
      [Op.and]: [
        { eventId: event.id },
        { userId: req.user.id },
        { status: 'attending' }
      ]
    }
  });
  if (!attendee && err) {
    const err = forbiddenError();
    return next(err);
  }

  const { preview } = req.body;
  const url = req.file ? await singleFileUpload({ file: req.file, public: true }) : null;
  const newEventImage = await event.createEventImage({ url, preview });

  res.json({
    id: newEventImage.id,
    url: newEventImage.url,
    preview: newEventImage.preview
  });
}

async function editEventImage(req, res, next) {
  const eventImage = await EventImage.findByPk(req.params.imageId);
  if (!eventImage) {
    const err = notFoundError("Event Image couldn't be found");
    return next(err);
  }

  const event = await eventImage.getEvent();
  const group = await Group.findByPk(event.groupId);

  if (group.organizerId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  const { preview } = req.body;
  const url = req.file ? await singleFileUpload({ file: req.file, public: true }) : null;
  const updatedEventImage = await eventImage.update({ url: url ? url : eventImage.url, preview });
  res.json({
    id: updatedEventImage.id,
    url: updatedEventImage.url,
    preview: updatedEventImage.preview
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

async function getEventImages(req, res, next) {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    const err = notFoundError("Event couldn't be found");
    return next(err);
  }

  const group = await Group.findByPk(event.groupId);
  const err = await checkUserRole(group, req.user.id);
  if (err) return next(err);

  const images = await EventImage.findAll({ where: { eventId: req.params.eventId }, attributes: ['id', 'url', 'preview'] });
  res.json({
    Images: images,
  });
}

module.exports = {
  getEventImages,
  createEventImage,
  editEventImage,
  deleteEventImage
}
