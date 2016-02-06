import {InvalidElement} from "../errors.js";

// Classes providing a shortcut way for access to the element attributes
// Abstract attributes handler.
class Attr {
  constructor(element) {
    if (!element || element.nodeType !== 1) {
      throw new InvalidElement("HTMLElement");
    }
    this.element = element;
    this.prefix = "";
  }

  // Converts every data-type to string
  static convertToString(value) {
    const t = typeof(value);
    let res = "";

    if (t === "string" || t === "number") {
      res += value;
    } else if (t === "boolean") {
      res += 0|value;
    } else if (value) {
      res = JSON.stringify(value);
    }

    return res;
  }

  has(key) {
    return this.element.hasAttribute(this.prefix + key);
  }

  get(key) {
    return this.element.getAttribute(this.prefix + key);
  }

  set(key, value) {
    return this.element.setAttribute(this.prefix + key, Attr.convertToString(value));
  }

  remove(key) {
    return this.element.removeAttribute(this.prefix + key);
  }

}

// Custom attributes
export class CustomAttr extends Attr {
  constructor(element) {
    super(element);
    this.prefix = "data-";
  }
}
