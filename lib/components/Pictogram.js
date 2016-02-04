import {InvalidElement} from "../errors.js";
import {$} from "../misc/utils.js";

// Generates a DOM id with customized basename.
// The generator uses a counter addeds to the end of the basename for ensure
// uniqueness of the id
const generateID = (function() {
  let counter = 0;
  const fn = function generateID(basename) {
    if (!basename) {
      basename = "uxon-picto";
    }
    ++counter;
    return basename + counter.toString(36);
  };
  return fn;
})();

// Seeks the viewBox used by the svg element
const findViewBox = (function() {

  // Generic replacement of viewBox
  const emptyViewBox = {x: 0, y: 0, width: 0, height: 0};
  // List of available elements that can declare a viewBox.
  const whitelist = ["image", "marker", "pattern", "svg", "symbol", "view"];

  // Checks if a svg element has its own valid viewBox declaration.
  function hasViewBox(svgElement) {
    if (!! svgElement.viewBox.baseVal) {
      const vb = svgElement.viewBox.baseVal;
      return (
        whitelist.indexOf(svgElement.tagName.toLowerCase()) &&
        (vb.height !== 0 || vb.width !== 0 || vb.x !== 0 || vb.y !== 0)
      );
    }
    return false;
  }

  // Rewinds in the hierarchy to find the effective viewBox.
  const fn = function findViewBox(svgElement) {
    let elem = svgElement;
    while(elem) {
      if (hasViewBox(elem)) {
        return elem.viewBox.baseVal;
      }
      elem = elem.viewportElement;
    }
    return emptyViewBox;
  };

  return fn;

})();


// Visual reference of icons.
// Contributor: Plato
// https://en.wikipedia.org/wiki/Theory_of_Forms
class Pictogram {

  constructor(svgElement) {

    if (!(svgElement instanceof SVGElement)) {
      throw new InvalidElement("SVGElement");
    }

    this.svgElement = svgElement;
    this.viewBox = null;
    this.titleID = "";  // Used by the `aria-labelledby` attributes.
    this.descID = "";   // Used by the `aria-describedby` attributes.

    // Captures the title and desc direct children elements as label
    // and description. If the ID is empty, generates one.

    const title = $(this.getIRI() + " > title:first-of-type", svgElement.parentNode);
    const desc = $(this.getIRI() + " > desc:first-of-type", svgElement.parentNode);
    if (title) {
      if (!title.id) {
        title.id = generateID(svgElement.id + "-t");
      }
      this.titleID = title.id;
    }
    if (desc) {
      if (!desc.id) {
        desc.id = generateID(svgElement.id + "-d");
      }
      this.descID = desc.id;
    }

  }

  // Gets the IRI of the pictogram.
  getIRI() {
    return "#" + this.svgElement.id;
  }

  // Gets the viewBox of the pictogram.
  getViewBox() {
    if (! this.viewBox) {
      this.viewBox = findViewBox(this.svgElement);
    }
    return this.viewBox;
  }

}

export default Pictogram;
