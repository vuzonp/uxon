import ns from "../misc/namespaces.js";

/**
 * Simple shortcut for document.body
 * @type {string}
 */
export const $body = document.body;

/**
 * Returns first element that matches CSS selector {selectors}.
 * Querying can optionally be restricted to {container}’s descendants
 * @see http://lea.verou.me/2015/04/jquery-considered-harmful/
 * @param {string} selectors
 * @param {Element} container
 * @returns {Element|null}
 */
export function $(selectors, container) {
  return (typeof selectors === "string") ?
    (container || document).querySelector(selectors) :
    null;
}

/**
 * Returns all elements that match CSS selector {expr} as an array.
 * Querying can optionally be restricted to {container}’s descendants
 * @see http://lea.verou.me/2015/04/jquery-considered-harmful/
 * @param {string} selectors
 * @param {Element} container
 * @returns {Array}
 */
export function $$(selectors, container) {
  return [].slice.call((container || document).querySelectorAll(selectors));
}

/**
 * Checks to see if an element is in the page"s body.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
 * @param {Element} element - The element to research.
 * @returns {boolean}
 */
export function isInPage(element) {
  return (element === $body) ? false : $body.contains(element);
}

/**
 * Assigns a css class to a html element.
 * This function is mainly used for maintain the compatibility with IE9.
 * @param {Element} element - The element to manipulates.
 * @param {string} cname - The class name to add.
 */
export function addClass(element, cname) {
  if ("classList" in element) {
    element.classList.add(cname);
  } else { // IE9
    element.className.baseVal += " " + cname;
  }
}

// Helper for remove a css class
// http://stackoverflow.com/questions/2155737/remove-css-class-from-element-with-javascript-no-jquery#2155787
// export function delClass(element, cname) {
//     if ("classList" in element) {
//         element.classList.remove(cname);
//     } else {
//         element.className.baseVal.replace(
//             new RegExp("(?:^|\\s)" + cname + "(?!\\S)"),
//             ""
//         );
//     }
// }


/**
 * Creates a new SVG Element (Only a shortcut).
 * @param {string} tagName - The tag name of the element to create.
 * @returns {SVGElement} The new element.
 */
export function createSVGElement(tagName) {
  return document.createElementNS(ns.svg, tagName);
}

/**
 * Removes an element from a DOM branch.
 * @param {Element} element - The element to remove.
 * @returns {Element} The removed element.
 */
export function removeElement(element) {
  return element.parentNode.removeChild(element);
}

/**
 * Generates a DOM id with customized basename.
 * The generator uses a counter addeds to the end of the basename for ensure
 * uniqueness of the id
 * @see https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute
 * @param {string} [prefix=u_] - The basename of the id.
 * @returns {string}
 */
export const generateID = (function() {
  let counter = 0;
  const fn = function generateID(prefix) {
    if (!prefix) {
      prefix = "u_";
    }
    ++counter;
    return prefix + counter.toString(36);
  };
  return fn;
})();
