import {InvalidElement} from "../errors.js";

const _owner = new WeakMap();
const _tfmList = new WeakMap();
const _area = new WeakMap();

// Transform class
class Transform {

  constructor(svgElement) {
    if (!svgElement.viewportElement) {
      throw new InvalidElement("A not `viewport` SVGElement");
    }

    _owner.set(this, svgElement.ownerSVGElement);
    _tfmList.set(this, svgElement.transform.baseVal);
    _area.set(this, svgElement.viewportElement.viewBox.baseVal);
  }

  clear() {
    _tfmList.get(this).clear();
  }

  rotate(a, x, y) {
    x = x || _area.get(this).width / 2;
    y = y || _area.get(this).height / 2;
    const tfm = _owner.get(this).createSVGTransform();
    tfm.setRotate(a, x, y);
    _tfmList.get(this).appendItem(tfm);
  }

  flipX() {
    const x = _area.get(this).width * -1;
    const y = 0;
    const tfm = _owner.get(this).createSVGTransform();
    tfm.setScale(-1, 1);
    tfm.setTranslate(x, y);
    _tfmList.get(this).appendItem(tfm);
  }

  flipY() {
    const x = 0;
    const y = _area.get(this).height * -1;
    const tfm = _owner.get(this).createSVGTransform();
    tfm.setScale(1, -1);
    tfm.setTranslate(x, y);
    _tfmList.get(this).appendItem(tfm);
  }

  translate(x, y) {
    const tfm = _owner.get(this).createSVGTransform();
    tfm.setTranslate(x, y);
    _tfmList.get(this).appendItem(tfm);
  }

  remove() {
    this.clear();
    _owner.delete(this);
    _tfmList.delete(this);
    _area.delete(this);
  }

}

export default Transform;
