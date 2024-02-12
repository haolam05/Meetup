const { singleFileUpload } = require('../awsS3');
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
  const group = await Group.findByPk(groupImage.Group.id);
  const memberIds = (await group.getMembers()).map(user => user.id);
  req.app.io.emit('membership', { msg: `An image in "${group.name}" group was deleted!`, userIds: memberIds });
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

  const { preview } = req.body;
  const url = req.file ? await singleFileUpload({ file: req.file, public: true }) : null;
  const newImage = await group.createGroupImage({ url, preview });

  const memberIds = (await group.getMembers()).map(user => user.id);
  req.app.io.emit('membership', { msg: `A new image has been added to "${group.name}" group!`, userIds: memberIds });

  res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  });
}

async function editGroupImage(req, res, next) {
  const groupImage = await GroupImage.findByPk(req.params.imageId, { include: Group });
  if (!groupImage) {
    const err = notFoundError("Group Image couldn't be found");
    return next(err);
  }

  if (groupImage.Group.organizerId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  const { preview } = req.body;
  const url = req.file ? await singleFileUpload({ file: req.file, public: true }) : null;
  const updatedImage = await groupImage.update({ url: url ? url : groupImage.url, preview });

  res.json({
    id: updatedImage.id,
    url: updatedImage.url,
    preview: updatedImage.preview
  });
}

async function getGroupImages(req, res, next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = notFoundError("Group couldn't be found");
    return next(err);
  }

  if (group.organizerId !== req.user.id) {
    const err = forbiddenError();
    return next(err);
  }

  const images = await GroupImage.findAll({ where: { groupId: req.params.groupId } });
  res.json({
    Images: images,
  });
}

module.exports = {
  getGroupImages,
  createGroupImage,
  editGroupImage,
  deleteGroupImage
}
