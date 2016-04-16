import {InvalidElement} from "../errors.js";

/**
 * Converts every data-type to string
 * @param {string} value - the value to convert.
 * @returns {string}
 */
function convertToString(value) {
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

/**
 * This classes provides a shortcut way for access to the attributes of an element.
 */
class Attr {

  /**
   * @param {Element} element - The element whose the Attr object manipulates the attributes.
   * @param {string} prefix - A string or namespace used for prefix the attributes names.
   */
  constructor(element, prefix) {
    if (!element || element.nodeType !== 1) {
      throw new InvalidElement("Element");
    }
    /** @type {Element} */
    this.element = element;
    /** @type {string} */
    this.prefix = prefix + "-";
  }

  /**
   * Returns a boolean value indicating whether the specified element has the specified attribute or not.
   * @param {!object} name - A string representing the name of the attribute.
   * @returns {boolean} holds the return value true or false.
   */
  has(name) {
    return this.element.hasAttribute(this.prefix + name);
  }

  /**
   * Returns the value of a specified attribute on the element.
   * @param {!object} name - A string representing the name of the attribute.
   * @returns {string|null} The value of the attribute.
   */
  get(name) {
    return this.element.getAttribute(this.prefix + name);
  }

  /**
   * Adds a new attribute or changes the value of an existing attribute on the specified element
   * @param {!object} name - A string representing the name of the attribute.
   * @param {mixed} value - The desired new value of the attribute.
   */
  set(name, value) {
    return this.element.setAttribute(this.prefix + name, convertToString(value));
  }

  /**
   * Removes an attribute from the specified element.
   * @param {!object} name - A string representing the name of the attribute.
   */
  remove(name) {
    return this.element.removeAttribute(this.prefix + name);
  }

}

/**
 * This classes provides a shortcut way for access to the custom-attributes of an element.
 */
export class CustomAttr extends Attr {
  /**
   * @param {Element} element
   */
  constructor(element) {
    super(element, "data");
  }
}

/**
 * This classes provides a shortcut way for access to the ARIA attributes of an element.
 */
export class AriaAttr extends Attr {
  /**
   * @param {Element} element
   */
  constructor(element) {
    super(element, "aria");
  }
}
