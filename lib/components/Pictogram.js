import {InvalidElement} from "../errors.js";
import {$, generateID, removeElement} from "../misc/utils.js";

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


const _svgElement = new WeakMap();
const _viewBox = new WeakMap();
const _titleID = new WeakMap(); // Used by the `aria-labelledby` attributes.
const _descID = new WeakMap();  // Used by the `aria-describedby` attributes.

// Visual reference of icons.
// Contributor: Plato
// https://en.wikipedia.org/wiki/Theory_of_Forms
class Pictogram {

  constructor(svgElement) {
    if (!(svgElement instanceof SVGElement)) {
      throw new InvalidElement("SVGElement");
    }

    _svgElement.set(this, svgElement);
    this.rename(svgElement.id);

    // Captures the title and desc direct children elements as label
    // and description. If the ID is empty, generates one.

    const title = $(this.getIRI() + " > title:first-of-type", svgElement.parentNode);
    const desc = $(this.getIRI() + " > desc:first-of-type", svgElement.parentNode);

    if (title) {
      if (!title.id) {
        title.id = generateID(svgElement.id + "-t");
      }
      _titleID.set(this, title.id);
    }
    if (desc) {
      if (!desc.id) {
        desc.id = generateID(svgElement.id + "-d");
      }
      _descID.set(this, desc.id);
    }


    Object.defineProperties(this, {
      descID: { get: function() {
        return _descID.get(this);
      }},
      svgElement: { get: function() {
        return _svgElement.get(this);
      }},
      titleID: { get: function() {
        return _titleID.get(this);
      }}
    });
  }

  // Gets the IRI of the pictogram.
  getIRI() {
    return "#" + _svgElement.get(this).id;
  }

  // Gets the viewBox of the pictogram.
  getViewBox() {
    if (! _viewBox.has(this)) {
      _viewBox.set(this, findViewBox(_svgElement.get(this)));
    }
    return _viewBox.get(this);
  }

  // Renames the pictogram.
  rename(name) {
    _svgElement.get(this).id = generateID("pict") + "-" + name;
  }

  remove() {
    removeElement(_svgElement.get(this));
    _svgElement.delete(this);
    _viewBox.delete(this);
    _titleID.delete(this);
    _descID.delete(this);
  }

}

export default Pictogram;
