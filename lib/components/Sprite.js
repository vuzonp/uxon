import { $, $$, $body, addClass, isInPage } from "../commons/utils.js";
import ns from "../commons/namespaces.js";
import Pictogram from "./Pictogram.js";

var counter = 0;

// Adds a prefix to the DOM identifiers of pictograms
function prefix(element, str) {
  var pictograms = {};
  element.id = str;
  $$("symbol[id], g[id]", element).forEach(function(child) {
    child.id = [str, child.id].join("-");
    pictograms[child.id] = new Pictogram(child);
  });

  $$("use", element).forEach(function(use) {
    use.setAttributeNS(
        ns.xlink,
        "href",
        "#" + str + "-" + use.getAttributeNS(ns.xlink, "href").slice(1)
    );
  });

  return pictograms;
}

class Sprite {

  constructor(svg) {
    if (!(svg instanceof SVGElement)) {
      throw new TypeError("Invalid sprite element");
    }

    // Do not display the sprite.
    svg.setAttribute("aria-hidden", true);
    svg.removeAttribute("height");
    svg.removeAttribute("width");
    addClass(svg, "uxon");
    addClass(svg, "uxon-sprite"); // a visually-hidden class.

    // Appends the element at the start of the document"s body.
    // https://code.google.com/p/chromium/issues/detail?id=349175
    if (!isInPage(svg)) {
      $body.insertBefore(svg, $body.firstChild);
    }

    this.element = svg;
    this.pictograms = prefix(svg, "uxon" + counter++);
  }

  // Creates a copy of the sprite.
  clone() {
    var svg = this.element.cloneNode(true);
    var sprite = new Sprite(svg);
    sprite.prefix(prefix);
    return sprite;
  }

  // Checks if the sprite contains a pictogram.
  has(id) {
    return (
      this.pictograms[id] &&
      this.pictograms[id] instanceof Pictogram
    );
  }

  // Searchs and finds a pictogram with the name of the pictogram.
  find(name) {
    var element = $("g[id$=" + name + "], symbol[id$=" + name + "]", this.element);
    return (element) ? this.get(element.id) : null;
  }

  // Gets a pictogram.
  get(id) {
    return this.pictograms[id] || null;
  }

  // Removes a pictogram.
  remove(id) {
    if (this.has(id)) {
      this.pictograms[id].parentNode.removeChild(this.pictograms[id]);
      this.pictograms[id] = null;
      return true;
    }

    return false;
  }

  // Updates the cache of pictograms.
  update() {
    this.pictograms = {};
    $$("symbol[id], g[id]", this.element).forEach(function(child) {
      this.pictograms[child.id] = new Pictogram(child);
    }, this);
  }

}

export default Sprite;
