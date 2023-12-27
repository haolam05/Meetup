const { GroupImage, Group } = require('../db/models');
const { notFoundError } = require('../utils/makeError');
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

module.exports = {
  deleteGroupImage
}
