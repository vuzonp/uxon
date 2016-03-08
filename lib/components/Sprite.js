import { $, $body, addClass, isInPage, generateID, removeElement } from "../misc/utils.js";
import {InvalidElement} from "../errors.js";
import Collection from "./Collection.js";
import Pictogram from "./Pictogram.js";

// Private collection of loaded pictograms
const _cache = new WeakMap();
const _svgElement = new WeakMap();

class Sprite {

  constructor(svgElement) {
    if (!(svgElement instanceof SVGElement) || svgElement.ownerSVGElement) {
      throw new InvalidElement("SVGElement", svgElement);
    }

    // Generates #ID
    svgElement.id = generateID("sprite") + svgElement.id;

    // Hides the sprite for the final user.
    svgElement.setAttribute("aria-hidden", true);
    svgElement.removeAttribute("height");
    svgElement.removeAttribute("width");
    addClass(svgElement, "uxon");
    addClass(svgElement, "uxon-sprite"); // a visually-hidden class.

    // Appends the element at the start of the document"s body.
    // https://code.google.com/p/chromium/issues/detail?id=349175
    if (!isInPage(svgElement)) {
      $body.insertBefore(svgElement, $body.firstChild);
    }

    _cache.set(this, new Collection());
    _svgElement.set(this, svgElement);

    Object.defineProperty(this, "svgElement", { get: function() {
      return _svgElement.get(this);
    }});
  }

  // Creates a copy of the sprite.
  clone() {
    return new Sprite(_svgElement.get(this).cloneNode(true));
  }

  // Searchs a pictogram from its name.
  findPictogram(name) {
    return this.getPictogram(
      $(`g[id$=${name}],symbol[id$=${name}]`, _svgElement.get(this))
    );
  }

  // Gets a pictogram from its ref element.
  getPictogram(svgElement) {
    if (!svgElement || !_svgElement.get(this).contains(svgElement)) {
      return false;
    } else if (!_cache.get(this).has(svgElement)) {
      _cache.get(this).set(svgElement, new Pictogram(svgElement));
    }
    return _cache.get(this).get(svgElement);
  }

  // Removes a pictogram from the sprite
  removePictogram(pictogram) {
    _cache.get(this).delete(pictogram.svgElement);
  }

  // Cleans the DOM before to delete the sprite.
  remove() {
    removeElement(_svgElement.get(this));
    _cache.delete(this);
  }

}

export default Sprite;
