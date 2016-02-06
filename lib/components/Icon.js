import ns from "../misc/namespaces.js";
import {CustomAttr} from "../misc/attributes.js";
import Pictogram from "./Pictogram.js";

var warehouse = [];
var key = "uxon-id";

// Moves the aria properties of an element to an other element
function moveAriaProps(ref, target) {
  var attr;
  var attrs = ref.attributes;
  var n = attrs.length - 1;
  for (; n > -1; --n) {
    attr = attrs[n];
    if (attr.nodeName.indexOf("aria-") > -1) {
      target.setAttribute(attr.nodeName, attr.value);
      ref.removeAttribute(attr.nodeName);
    }
  }
}

// Connectors template.
var tplConnector = (function() {
  var svg = document.createElementNS(ns.svg, "use");
  svg.setAttributeNS(
    ns.xlink,
    "href",
    "#empty"
  );
  return svg;
})();

// SVG icons template.
var tplShadow = (function() {
  var svg = document.createElementNS(ns.svg, "svg");
  svg.className.baseVal = "uxon uxon-icon";
  svg.setAttribute("role", "img");
  return svg;
})();

function createIconHandler(element, meta) {
  var id = warehouse.push(new IconHandler(element, meta));
  meta.set(key, --id);
  return warehouse[id];
}

// Represents the displayed icons.
class IconHandler {

  constructor(element, meta) {
    if (!element.parentNode) {
      throw new Error("Icon's element must have a parent node");
    }

    // Makes the svg icon in clonning pre-defined elements.
    this.connector = tplConnector.cloneNode();
    this.element = element;
    this.meta = meta;
    var shadow = this.shadow = tplShadow.cloneNode();

    // Accessibility: specifies the element as an image
    // see: http://www.w3.org/wiki/SVG_Accessibility/ARIA_roles_for_graphics#icon
    // see: http://www.w3.org/TR/wai-aria/roles
    moveAriaProps(element, shadow);
    element.setAttribute("aria-hidden", "true");

    // Appends the svg in the document
    shadow.appendChild(this.connector);
    this.element.parentNode.insertBefore(
      shadow,
      element.nextSibling
    );
  }

  // Generates the icon
  draw(pictogram) {
    if (!(pictogram instanceof Pictogram)) {
      throw new TypeError("Invalid pictogram");
    }

    this.connector.setAttributeNS(
      ns.xlink,
      "xlink:href",
      "#" + pictogram.element.id
    );

    // Force the viewBox attribute. In principle it is not necessary but in
    // reality, the display is buggy on most browsers without it.
    var box = pictogram.getViewBox();
    this.setViewBox(
      box.x,
      box.y,
      box.width,
      box.height
    );

    // Adds accessibility informations
    if (pictogram.title && !this.shadow.hasAttribute("aria-label")) {
      this.shadow.setAttribute("aria-labelledby", pictogram.titleID);
    }

    if (pictogram.desc) {
      this.shadow.setAttribute("aria-describedby", pictogram.descID);
    }

    // Applies effects.
    if (this.meta.has("rotate")) {
      this.rotate(this.meta.get("rotate"));
    }

    if (this.meta.has("flip-x")) {
      this.flipX();
    }

    if (this.meta.has("flip-y")) {
      this.flipY();
    }

    if (this.meta.has("translate")) {
      this.translate(this.meta.get("translate").split(","));
    }

    if (this.meta.has("matrix")) {
      this.matrix(this.meta.get("matrix").split(","));
    }

  }

  // Applies a new transformation to the icon.
  addTransform(prop, values) {
    var connector = this.connector;
    var tfmStr = connector.getAttribute("transform");
    var inline = prop + "(" + values.join(",") + ")";
    if (tfmStr) {
      tfmStr += " " + inline;
    } else {
      tfmStr = inline;
    }

    connector.setAttribute("transform", tfmStr);
  }

  // Erases all the transformations.
  clearTransform() {
    this.connector.removeAttribute("transform");
  }

  // Flips horizontally the icon.
  flipX(refresh) {
    var x = this.getViewBox().width * -1;
    var y = 0;
    this.addTransform("scale", [-1, 1], refresh);
    this.addTransform("translate", [x, y], refresh);
  }

  // Flips vertically the icon.
  flipY(refresh) {
    var x = 0;
    var y = this.getViewBox().height * -1;
    this.addTransform("scale", [1, -1], refresh);
    this.addTransform("translate", [x, y], refresh);
  }

  // Rotates the icon.
  rotate(a) {
    var vb = this.getViewBox();
    this.addTransform(
      "rotate",
      [parseFloat(a), vb.width / 2, vb.height / 2]
    );
  }

  // Moves the icon.
  translate(pos) {
    var style = this.shadow.style;
    var tfmStr = style.transform || style.msTransform || style.webkitTransform || style.oTransform || "";

    if (tfmStr) {
      tfmStr += " ";
    }

    tfmStr += "translate(" + pos.join(",") + ")";

    style.msTransform = tfmStr;
    style.oTransform = tfmStr;
    style.webkitTransform = tfmStr;
    style.transform = tfmStr;
  }

  // Gets the reference size of the icon
  getRefSize() {
    var size = this.getSize();
    return Math.max(size.height, size.width);
  }

  // Gets the size of the icon
  getSize() {
    return this.shadow.getBoundingClientRect();
  }

  // Gets the viewBox of the svg shadow element
  getViewBox() {
    return this.shadow.viewBox.baseVal;
  }

  // Forces the viewbox of the icon
  setViewBox(x, y, width, height) {
    this.shadow.setAttribute(
      "viewBox",
      [x, y, width, height].join(" ")
    );
  }

}

const Icon = {

  has(element) {
    if (element && element.nodeType) {
      var meta = new CustomAttr(element);
      var id = meta.get(key);
      return (id && warehouse[id]);
    }

    return false;
  },

  load(element) {
    if (!element || !element.nodeType) {
      throw new TypeError("Invalid element");
    }

    var meta = new CustomAttr(element);
    if (meta.has(key)) {
      var id = meta.get(key);
      if (warehouse[id]) {
        return warehouse[id];
      } else {
        meta.remove(key);
        return createIconHandler(element, meta);
      }
    } else {
      return createIconHandler(element, meta);
    }
  },

  remove(element) {
    var meta = new CustomAttr(element);
    if (meta.has(key)) {
      var id = meta.get(key);
      var icon = warehouse[id];

      meta.remove(key);
      icon.remove();
      warehouse[id] = null;
      return true;
    }

    return false;
  },
};

export default Icon;
