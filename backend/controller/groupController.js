const { Group, GroupImage, Venue } = require('../db/models');

async function getGroup(req, res) {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: GroupImage
      },
      {
        model: Venue,
        through: {
          attributes: []
        }
      }
    ]
  });
  res.json(group);
}

async function getGroups(_req, res) {
  const groups = await Group.findAll();
  res.json({ Groups: await _countNumMembersAndGetPreviewURL(groups) });
}

async function getGroupsOrganizedByCurrentUser(req, res) {
  const groupsByCurrentUser = await req.user.getGroups();
  res.json({ Groups: await _countNumMembersAndGetPreviewURL(groupsByCurrentUser) });

}
async function _countNumMembersAndGetPreviewURL(groups) {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const members = await group.getMembers();
    const previewImages = await group.getGroupImages({ where: { preview: true } });
    const previewImage = previewImages.length ? previewImages[0].url : 'Preview Image Not Found';
    groups[i] = { ...group.toJSON(), numMembers: members.length, previewImage };
  }
  return groups;
}

module.exports = {
  getGroup,
  getGroups,
  getGroupsOrganizedByCurrentUser
}
