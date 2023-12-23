const { Membership, Group } = require('../db/models');
const { notFoundError } = require('../utils/makeError');
const checkUserRole = require('../utils/userRoleAuthorization');

async function getGroupMembers(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  let members = await group.getMembers();
  if (req.user) {
    const notAuthorized = await checkUserRole(group, req.user.id);
    if (notAuthorized) members = members.filter(member => member.Membership.status != 'pending')
  } else {
    members = members.filter(member => member.Membership.status != 'pending')
  }

  res.json({ Members: members });
}

module.exports = {
  getGroupMembers
}
