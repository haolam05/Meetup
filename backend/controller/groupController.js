const { Group } = require('../db/models');

async function getAllGroups(req, res) {
  let groups = await Group.findAll();

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const members = await group.getMembers();
    const previewImages = await group.getGroupImages({ where: { preview: true } });
    console.log(previewImages.map(img => img.toJSON()));
    const previewImage = previewImages.length ? previewImages[0].url : 'Preview Image Not Found';
    groups[i] = { ...group.toJSON(), numMembers: members.length, previewImage };
  }

  res.json({ Groups: groups });
}

module.exports = {
  getAllGroups
}
