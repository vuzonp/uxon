import {InvalidArgument, InvalidElement, RuntimeException} from "../errors.js";
import {AriaAttr, CustomAttr} from "../misc/attributes.js";
import ns from "../misc/namespaces.js";
import snippets from "./snippets.js";
import Pictogram from "./Pictogram.js";
import Transform from "./Transform.js";

class IconTransform extends Transform {

  // Moves the SVG element from its initial position.
  // Ovverides the parent's method for use stylesheets.
  translate(x , y) {
    const style = this.svgElement.style;
    let tfmStr = style.transform || style.msTransform ||
                 style.webkitTransform || style.oTransform || "";
    if (tfmStr) {
      tfmStr += " ";
    }

    tfmStr += "translate(" + [x, y].join(",") + ")";

    style.msTransform = tfmStr;
    style.oTransform = tfmStr;
    style.webkitTransform = tfmStr;
    style.transform = tfmStr;
  }

}

// @private {IconTransform} tfmInstance - Instance of the Transform class
const tfmInstance = Symbol("tfmInstance");

class Icon {

  constructor(element) {
    if (!(element instanceof HTMLElement)) {
      throw new InvalidElement("HTMLElement", element);
    }
    element.setAttribute("role", "img");

    this.aria = new AriaAttr(element);
    this.element = element;
    this.meta = new CustomAttr(element);
    this.svgElement = Icon.snippets.icon.cloneNode();
    this.connector = Icon.snippets.connector.cloneNode();
    this.svgElement.appendChild(this.connector);
    // this.draw(Icon.replacement);
  }

  applyTransforms() {
    if (this.meta.has("rotate")) {
      this.transform().rotate(this.meta.get("rotate"));
    } else if (this.meta.has("rotate")) {
      this.transform().rotate(this.meta.get("rotate"));
    }
  }

  draw(pictogram) {
    if (!(pictogram instanceof Pictogram)) {
      throw new InvalidArgument("Invalid Pictogram");
    }
    // this.erase();
    this.pictogram = pictogram;

    // Adds DOM nodes required for rendering
    this.element.appendChild(this.svgElement);

    // Force the viewBox attribute. In principle it is not necessary but in
    // reality, the display is buggy on most browsers without it.
    const vb = pictogram.getViewBox();
    const vbStr = [vb.x, vb.y, vb.width, vb.height].join(" ");
    this.svgElement.setAttribute(
      "viewBox",
      vbStr
    );

    // Applies aria complentary informations if they are not override by direct
    // label and descriptions.
    if (pictogram.titleID && !this.aria.has("label")) {
      this.aria.set("labelledby", pictogram.titleID);
    }
    if (pictogram.descID && !this.aria.has("description")) {
      this.aria.set("descriptedby", pictogram.descID);
    }

    // Links to the pictogram
    this.connector.setAttributeNS(ns.xlink, "xlink:href", pictogram.getIRI());

    // Applies transformations provided by attributes
    this.applyTransforms();
  }

  remove() {
    // Empties the element of its children.
    const elem = this.element;
    while(elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
    this[tfmInstance] = null;
    this.aria.remove("labelledby");
    this.aria.remove("descriptedby");
  }

  getSize() {
    return this.svgElement.getBoundingClientRect();
  }

  getRefSize() {
    const size = this.getSize();
    return Math.max(size.height, size.width);
  }

  transform() {
    if (!this[tfmInstance]) {
      if (!this.svgElement) {
        throw new RuntimeException("Unable to transform a non-drawn icon.");
      }
      this[tfmInstance] = new IconTransform(this.connector);
    }
    return this[tfmInstance];
  }

}

Icon.snippets = snippets;


export default Icon;
