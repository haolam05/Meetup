const { Group } = require('../db/models');

async function getAllGroups(_req, res) {
  const groups = await Group.findAll();
  res.json({ Groups: await _countNumMembersAndGetPreviewURL(groups) });
}

async function getAllGroupsOrganizedByCurrentUser(req, res) {
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
  getAllGroups,
  getAllGroupsOrganizedByCurrentUser
}
