import {InvalidElement} from "../errors.js";

// Private attributes
const _owner = new WeakMap();
const _tfmList = new WeakMap();
const _area = new WeakMap();

const _tfmRotate = new WeakMap();
const _tfmFlipX = new WeakMap();
const _tfmFlipY = new WeakMap();

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

  appendItem() {
    return _tfmList.get(this).appendItem(_owner.get(this).createSVGTransform());
  }

  /**
   * Clear all the transformations applied to the svg element.
   */
  clear() {
    _tfmList.get(this).clear();
    // _tfmList.removeItem(_tfmOffset.get(this));
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
    // Init the item used by rotations
    if (!_tfmRotate.has(this)) {
      _tfmRotate.set(this, this.appendItem());
    }
    // Apply the rotation
    const tfm = _tfmRotate.get(this);
    tfm.setRotate(a, x, y);
    // return tfm;
  }

  /**
   * Performs a horizontal flip.
   */
  // flipX() {
  //   if (!_tfmFlipX.has(this)) {
  //     _tfmFlipX.set(this, [this.appendItem(), this.appendItem()]);
  //   }
  //   const x = _area.get(this).width * -1;
  //   const y = 0;
  //   const tfm = _tfmList.get(this);
  //   tfm[0].setScale(-1, 1);
  //   tfm[1].setTranslate(x, y);
  // }
  flipX() {
    const x = _area.get(this).width * -1;
    const y = 0;
    const tfm = (_tfmFlipX.has(this)) ?
      _tfmFlipX.get(this) :
      _tfmFlipX.set(this, [this.appendItem(), this.appendItem()]).get(this);

    // Toggles the value
    if (tfm[0].matrix.a !== -1) {
      tfm[0].setScale(-1, 1);
      tfm[1].setTranslate(x, y);
    } else {
      tfm[0].setScale(1, 1);
      tfm[1].setTranslate(0, 0);
    }
  }

  /**
   * Performs a vertical flip.
   */
  flipY() {
    const x = 0;
    const y = _area.get(this).height * -1;
    const tfm = (_tfmFlipY.has(this)) ?
      _tfmFlipY.get(this) :
      _tfmFlipY.set(this, [this.appendItem(), this.appendItem()]).get(this);

    // Toggles the value
    if (tfm[0].matrix.d !== -1) {
      tfm[0].setScale(1, -1);
      tfm[1].setTranslate(x, y);
    } else {
      tfm[0].setScale(1, 1);
      tfm[1].setTranslate(0, 0);
    }
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
