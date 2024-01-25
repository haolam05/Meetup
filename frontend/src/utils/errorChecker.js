import { enabledSubmitButton } from "./dom";

export const hasError = (setErrors, condition, dom, errorName, errorMsg) => {
  if (condition) {
    enabledSubmitButton();
    dom.scrollIntoView();
    setErrors({ [errorName]: errorMsg });
    return true;
  }
  return false;
};
