export const getPreviewImageUrl = obj => {
  return (!obj.previewImage || obj.previewImage === "Preview Image Not Found") ? "/images/no-preview-available.jpg" : obj.previewImage;
}
