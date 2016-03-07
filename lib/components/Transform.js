import {InvalidElement} from "../errors.js";

// Transform class
class Transform {

  constructor(svgElement) {
    if (!svgElement.viewportElement) {
      throw new InvalidElement("A not `viewport` SVGElement");
    }

    this.owner = svgElement.ownerSVGElement;
    this.svgElement = svgElement;
    this.tfmList = svgElement.transform.baseVal;
    this.area = svgElement.viewportElement.viewBox.baseVal;
  }

  clear() {
    this.tfmlist.clear();
  }

  rotate(a, x, y) {
    x = x || this.area.width / 2;
    y = y || this.area.height / 2;
    const tfm = this.owner.createSVGTransform();
    tfm.setRotate(a, x, y);
    this.tfmList.appendItem(tfm);
  }

  flipX() {
    const x = this.area.width * -1;
    const y = 0;
    const tfm = this.owner.createSVGTransform();
    tfm.setScale(-1, 1);
    tfm.setTranslate(x, y);
    this.tfmList.appendItem(tfm);
  }

  flipY() {
    const x = 0;
    const y = this.area.height * -1;
    const tfm = this.owner.createSVGTransform();
    tfm.setScale(1, -1);
    tfm.setTranslate(x, y);
    this.tfmList.appendItem(tfm);
  }

  translate(x, y) {
    const tfm = this.owner.createSVGTransform();
    tfm.setTranslate(x, y);
    this.tfmList.appendItem(tfm);
  }

}

export default Transform;
