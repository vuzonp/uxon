import {InvalidElement} from "../errors.js";

// Private attributes
const _owner = new WeakMap();
const _tfmList = new WeakMap();
const _area = new WeakMap();

/**
 * The Transform class is in charge of the effects applied to components.
 */
class Transform {

  /**
   * @param {SVGElement} svgElement - The element to which apply the transformations.
   * @throws {InvalidElement} When the `svgElement` argument is wrong or not transformable.
   */
  constructor(svgElement) {
    if (!svgElement.viewportElement) {
      throw new InvalidElement("A not `viewport` SVGElement");
    }

    _owner.set(this, svgElement.ownerSVGElement);
    _tfmList.set(this, svgElement.transform.baseVal);
    _area.set(this, svgElement.viewportElement.viewBox.baseVal);
  }

  /**
   * Clear all the transformations applied to the svg element.
   */
  clear() {
    _tfmList.get(this).clear();
  }

  /**
   * Performs a rotation about a given point.
   * @param {!number} a - The rotate angle degrees.
   * @param {?number} x - The x-axis position
   * @param {?number} y - The y-axis position
   */
  rotate(a, x, y) {
    x = x || _area.get(this).width / 2;
    y = y || _area.get(this).height / 2;
    const tfm = _owner.get(this).createSVGTransform();
    tfm.setRotate(a, x, y);
    _tfmList.get(this).appendItem(tfm);
  }

  /**
   * Performs a horizontal flip.
   */
  flipX() {
    const x = _area.get(this).width * -1;
    const y = 0;
    const tfm = _owner.get(this).createSVGTransform();
    tfm.setScale(-1, 1);
    tfm.setTranslate(x, y);
    _tfmList.get(this).appendItem(tfm);
  }

  /**
   * Performs a vertical flip.
   */
  flipY() {
    const x = 0;
    const y = _area.get(this).height * -1;
    const tfm = _owner.get(this).createSVGTransform();
    tfm.setScale(1, -1);
    tfm.setTranslate(x, y);
    _tfmList.get(this).appendItem(tfm);
  }

  /**
   * Moves along the axis
   * @param {?number} x - The x-axis position
   * @param {?number} y - The y-axis position
   */
  translate(x, y) {
    const tfm = _owner.get(this).createSVGTransform();
    tfm.setTranslate(x, y);
    _tfmList.get(this).appendItem(tfm);
  }

  /**
   * Cleans the component before its destruction.
   */
  remove() {
    this.clear();
    _owner.delete(this);
    _tfmList.delete(this);
    _area.delete(this);
  }

}

export default Transform;
