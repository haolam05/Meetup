const { Venue, Group } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const { check } = require('express-validator');
const handleValidationErrors = require('../utils/validation');

async function getGroupVenues(req, res, next) {
  const group = await Group.findByPk(req.params.groupId, {
    include: {
      model: Venue,
      through: {
        attributes: []
      }
    },
  });

  const err = await _authenticate(group, req.user.id);
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
  const err = await _authenticate(group, req.user.id);

  if (err) return next(err);
  const newVenue = await group.createVenue(req.body);

  res.json({
    id: newVenue.id,
    groupId: newVenue.groupId,
    address: newVenue.address,
    city: newVenue.city,
    state: newVenue.state,
    lat: newVenue.lat,
    lng: newVenue.lng
  });
}

async function editVenue(req, res, next) {
  const venue = await Venue.findByPk(req.params.venueId);

  if (!venue) {
    const err = notFoundError("Venue couldn't be found");
    return next(err);
  }

  const group = await venue.getGroupOwner();
  const err = await _authenticate(group, req.user.id);
  if (err) return next(err);

  const updatedVenue = await venue.update(req.body, { attributes: { exclude: ['updatedAt'] } });
  res.json(updatedVenue);
}

async function _authenticate(group, userId) {
  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return err;
  }

  if (group.organizerId != userId) {
    const members = await group.getMembers({ where: { id: userId } });
    if (!members.length || members[0].Membership.status != 'co-host') {
      const err = forbiddenError();
      return err;
    }
  }

  return null;
}

module.exports = {
  getGroupVenues,
  validateCreateVenue,
  createGroupVenue,
  editVenue
}
