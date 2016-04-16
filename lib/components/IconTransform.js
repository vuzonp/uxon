import Transform from "./Transform.js";

/**
 * Customized Transform class used by the icons.
 */
class IconTransform extends Transform {

  /**
   * Moves along the axis (uses CSS engine).
   * Overrides the parent's method for use stylesheets.
   *
   * @param {number} x - The x-axis position
   * @param {number} y - The y-axis position
   */
  translate(x , y) {
    // Selects the already existing transformation.
    const style = this.svgElement.style;
    let tfmStr = style.transform || style.msTransform ||
                 style.webkitTransform || style.oTransform || "";
    if (tfmStr) {
      tfmStr += " ";
    }

    // Adds the new transformation at the end of string.
    tfmStr += "translate(" + [x, y].join(",") + ")";

    // Updates the transformation.
    style.msTransform = tfmStr;
    style.oTransform = tfmStr;
    style.webkitTransform = tfmStr;
    style.transform = tfmStr;
  }

}

export default IconTransform;
