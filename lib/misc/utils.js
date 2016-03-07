import ns from "../misc/namespaces.js";

// Simple shortcut...
export const $body = document.body;

// DOM selectors. The results are returned in arrays.
// http://lea.verou.me/2015/04/jquery-considered-harmful/
export function $(selectors, container) {
  return (typeof selectors === "string") ?
          (container || document).querySelector(selectors) :
          null;
}

export function $$(selectors, container) {
  return [].slice.call((container || document).querySelectorAll(selectors));
}

// Checks to see if an element is in the page"s body.
// https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
export function isInPage(node) {
  return (node === $body) ? false : $body.contains(node);
}

// Assigns a css class to a html element.
// This function is mainly used for maintain the compatibility with IE9.
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


// Creates a new SVG Element (Only a shortcut).
export function createSVGElement(tagName) {
  return document.createElementNS(ns.svg, tagName);
}

// Removes an element from a DOM branch.
export function removeElement(element) {
  return element.parentNode.removeChild(element);
}

// Generates a DOM id with customized basename.
// The generator uses a counter addeds to the end of the basename for ensure
// uniqueness of the id
// https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute
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
