const { forbiddenError } = require('./makeError');

async function checkUserRole(group, userId) {
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

module.exports = checkUserRole;
