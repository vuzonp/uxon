import { $, $body, addClass, isInPage, generateID, removeElement } from "../misc/utils.js";
import {InvalidElement} from "../errors.js";
import Collection from "./Collection.js";
import Pictogram from "./Pictogram.js";

// Private attributes
const _cache = new WeakMap();
const _svgElement = new WeakMap();

/**
 * Represents a collection of pictograms.
 */
class Sprite {

  /**
   * @param {SVGElement} svgElement - The SVG representation of the component.
   * @throws {InvalidElement} When the `svgElement` argument is wrong.
   */
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

    // ReadOnly properties
    Object.defineProperty(this, "svgElement", { get: function() {
      return _svgElement.get(this);
    }});
  }

  /**
   * Creates a copy of the sprite.
   * @returns {Sprite} A duplicated Sprite.
   */
  clone() {
    return new Sprite(_svgElement.get(this).cloneNode(true));
  }

  /**
   * Searchs then returns a pictogram from the sprite in using its name.
   * @param {string} name - The name of the pictogram
   * @returns {Pictogram|undefined}
   */
  findPictogram(name) {
    return this.getPictogram(
      $(`g[id$=${name}],symbol[id$=${name}]`, _svgElement.get(this))
    );
  }

  /**
   * Returns a specified pictogram from the sprite in using its element.
   * @param {Element} svgElement - A child of the SVG element of the sprite.
   * @returns {Pictogram|undefined}
   */
  getPictogram(svgElement) {
    if (!svgElement || !_svgElement.get(this).contains(svgElement)) {
      return undefined;
    } else if (!_cache.get(this).has(svgElement)) {
      _cache.get(this).set(svgElement, new Pictogram(svgElement));
    }
    return _cache.get(this).get(svgElement);
  }

  /**
   * Removes a pictogram from the sprite
   * @param {Pictogram} pictogram - The pictogram to remove.
   */
  removePictogram(pictogram) {
    _cache.get(this).delete(pictogram.svgElement);
  }

  /**
   * Cleans the component before its destruction.
   */
  remove() {
    removeElement(_svgElement.get(this));
    _cache.delete(this);
    _svgElement.delete(this);
  }

}

export default Sprite;
