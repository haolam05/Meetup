export const getProfileImageUrl = url => {
  return url ? url : "/images/default-avatar.png";
}

export const getPreviewImageUrl = obj => {
  return (!obj.previewImage || obj.previewImage === "Preview Image Not Found") ? "/images/no-preview-available.jpg" : obj.previewImage;
}

export const updateFile = (e, setImage) => {
  const file = e.target.files[0];
  if (file) setImage(file);
};
