export const setPropertyOnDom = (selector, property, value) => {
  [...document.querySelectorAll(selector)].forEach(el => (el.style[property] = value));
}
