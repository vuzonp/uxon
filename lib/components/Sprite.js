import { $, $body, addClass, isInPage, generateID, removeElement } from "../misc/utils.js";
import {InvalidElement} from "../errors.js";
import Collection from "./Collection.js";
import Pictogram from "./Pictogram.js";

// Private collection of loaded pictograms
const cache = Symbol("cache");

class Sprite {

  constructor(svgElement) {
    if (!(svgElement instanceof SVGElement) || svgElement.ownerSVGElement) {
      throw new InvalidElement("SVGElement", svgElement);
    }

    // Generates #ID
    svgElement.id = generateID("sprite") + svgElement.id;

    this.svgElement = svgElement;

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

    this[cache] = new Collection(Pictogram);
  }

  // Creates a copy of the sprite.
  clone() {
    return new Sprite(this.svgElement.cloneNode(true));
  }

  // Searchs a pictogram from its name.
  findPictogram(name) {
    return this.getPictogram(
      $(`g[id$=${name}],symbol[id$=${name}]`, this.svgElement)
    );
  }

  // Gets a pictogram from its ref element.
  getPictogram(svgElement) {
    if (!svgElement || !this.svgElement.contains(svgElement)) {
      return false;
    } else if (!this[cache].has(svgElement)) {
      this[cache].set(svgElement, new Pictogram(svgElement));
    }
    return this[cache].get(svgElement);
  }

  // Removes a pictogram from the sprite
  removePictogram(pictogram) {
    this[cache].delete(pictogram.svgElement);
  }

  // Cleans the DOM before to delete the sprite.
  remove() {
    this.cache = null;
    removeElement(this.svgElement);
  }

}

export default Sprite;
