const { Venue, Group } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const { Op } = require('sequelize');

async function getGroupVenues(req, res, next) {
  const group = await Group.findByPk(req.params.groupId, {
    include: {
      model: Venue,
      through: {
        attributes: []
      }
    },
  });

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  if (group.organizerId != req.user.id) {
    const members = await group.getMembers({ where: { id: req.user.id } });
    if (!members.length || members[0].Membership.status != 'co-host') {
      const err = forbiddenError();
      return next(err);
    }
  }

  res.json({ Venues: group.Venues });
}

module.exports = {
  getGroupVenues
}
