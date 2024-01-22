const { GroupImage, Group } = require('../db/models');
const { notFoundError, forbiddenError } = require('../utils/makeError');
const checkUserRole = require('../utils/userRoleAuthorization');

async function deleteGroupImage(req, res, next) {
  const groupImage = await GroupImage.findByPk(req.params.imageId, { include: Group });
  if (!groupImage) {
    const err = notFoundError("Group Image couldn't be found");
    return next(err);
  }

  const err = await checkUserRole(groupImage.Group, req.user.id);
  if (err) return next(err);

  await groupImage.destroy();
  res.json({ message: 'Successfully deleted' });
}

async function createGroupImage(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  if (group.organizerId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  const newImage = await group.createGroupImage(req.body);
  res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  });
}

module.exports = {
  createGroupImage,
  deleteGroupImage
}
