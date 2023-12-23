const { Membership, Group } = require('../db/models');
const { notFoundError } = require('../utils/makeError');
const checkUserRole = require('../utils/userRoleAuthorization');

async function getGroupMembers(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  let members = await group.getMembers({ attributes: { exclude: ['username'] } });
  members = members.map(m => ({ id: m.id, firstName: m.firstName, lastName: m.lastName, Membership: { status: m.Membership.status } }));
  if (req.user) {
    const notAuthorized = await checkUserRole(group, req.user.id);
    if (notAuthorized) members = members.filter(member => member.Membership.status != 'pending')
  } else {
    members = members.filter(member => member.Membership.status != 'pending')
  }

  res.json({ Members: members });
}

async function createMember(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  const member = await Membership.findOne({ where: { userId: req.user.id } });
  if (member) {
    const err = new Error();
    err.status = 400;
    err.message = member.status === 'pending' ? 'Membership has already been requested' : 'User is already a member of the group';
    return next(err)
  }

  const newMember = await Membership.create({ userId: req.user.id, groupId: group.id, status: 'pending' });
  res.json({
    memberId: newMember.id,
    status: newMember.status
  });
}

module.exports = {
  getGroupMembers,
  createMember
}
