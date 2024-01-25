export const setPropertyOnDom = (selector, property, value) => {
  [...document.querySelectorAll(selector)].forEach(el => (el.style[property] = value));
}

export const disabledSubmitButton = () => {
  document.querySelector("button[type=submit]").setAttribute("disabled", "");
}

export const enabledSubmitButton = () => {
  document.querySelector("button[type=submit]").removeAttribute("disabled");
}
