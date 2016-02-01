var prefix = "data-";

export default class MetaData {

  constructor(element) {
    this.element = element;
  }

  has(key) {
    return this.element.hasAttribute(prefix + key);
  }

  get(key) {
    return this.element.getAttribute(prefix + key);
  }

  set(key, value) {
    return this.element.setAttribute(prefix + key, value);
  }

  remove(key) {
    return this.element.removeAttribute(prefix + key);
  }

}
