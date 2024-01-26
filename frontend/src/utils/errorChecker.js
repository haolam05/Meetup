import { enabledSubmitButton } from "./dom";

export const hasError = (setErrors, condition, errorName, errorMsg, dom = null) => {
  if (condition) {
    enabledSubmitButton();
    if (dom) dom.scrollIntoView();
    setErrors({ [errorName]: errorMsg });
    return true;
  }
  return false;
};

export const inValidImage = (setErrors, image) => {
  const condition = image && image.name && !['png', 'jpeg', 'jpg'].includes(image.name.split('.')[1]);
  const errName = "image";
  const errMsg = "Invalid file. Only .png, .jpg and .jpeg files can be uploaded";
  return hasError(setErrors, condition, errName, errMsg);
}

export const invalidPassword = (setErrors, pswd1, pswd2) => {
  const condition = pswd1 !== pswd2;
  const errName = "confirmPassword";
  const errMsg = "Confirm Password field must be the same as the Password field";
  return hasError(setErrors, condition, errName, errMsg);
}
