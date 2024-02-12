const { Venue, Group } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const { check } = require('express-validator');
const handleValidationErrors = require('../utils/validation');
const checkUserRole = require('../utils/userRoleAuthorization');

async function getGroupVenues(req, res, next) {
  const group = await Group.findByPk(req.params.groupId, {
    include: {
      model: Venue
    },
  });

  const err = await checkUserRole(group, req.user.id);
  if (err) return next(err);

  res.json({ Venues: group.Venues });
}

function validateCreateVenue() {
  return [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be within -180 and 180'),
    handleValidationErrors
  ];
}

async function createGroupVenue(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);
  const err = await checkUserRole(group, req.user.id);

  if (err) return next(err);
  try {
    const newVenue = await group.createVenue(req.body);
    const memberIds = (await group.getMembers()).map(user => user.id);

    req.app.io.emit('membership', { msg: `A new venue is added to "${group.name}" group! Please refresh!`, userIds: memberIds });
    res.json({
      id: newVenue.id,
      groupId: newVenue.groupId,
      address: newVenue.address,
      city: newVenue.city,
      state: newVenue.state,
      lat: newVenue.lat,
      lng: newVenue.lng
    });
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      const err = new Error("Address already exist!")
      return next(err)
    }
    const errors = e.errors.reduce((acc, err) => (acc.errors[err.path] = err.message) && acc, { errors: {} });
    return next(errors);
  }
}

async function editVenue(req, res, next) {
  const venue = await Venue.findByPk(req.params.venueId);

  if (!venue) {
    const err = notFoundError("Venue couldn't be found");
    return next(err);
  }

  const group = await venue.getGroupOwner();
  const err = await checkUserRole(group, req.user.id);
  if (err) return next(err);

  const updatedVenue = await venue.update(req.body);
  const memberIds = (await group.getMembers()).map(user => user.id);

  req.app.io.emit('membership', { msg: `A venue of "${group.name}" group is updated! Please refresh!`, userIds: memberIds });
  res.json({
    id: updatedVenue.id,
    groupId: updatedVenue.groupId,
    address: updatedVenue.address,
    city: updatedVenue.city,
    state: updatedVenue.state,
    lat: updatedVenue.lat,
    lng: updatedVenue.lng
  });
}

async function deleteVenue(req, res, next) {
  const venue = await Venue.findByPk(req.params.venueId);

  if (!venue) {
    const err = notFoundError("Venue couldn't be found");
    return next(err);
  }

  const group = await venue.getGroupOwner();
  if (group.organizerId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  await venue.destroy();
  const memberIds = (await group.getMembers()).map(user => user.id);

  req.app.io.emit('membership', { msg: `A venue of "${group.name}" group is deleted! Please refresh!`, userIds: memberIds });
  res.json({ message: 'Sucessfully deleted' });
}

module.exports = {
  getGroupVenues,
  validateCreateVenue,
  createGroupVenue,
  editVenue,
  deleteVenue
}
