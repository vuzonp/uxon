// Visual reference of icons.
// Contributor: Plato
// https://en.wikipedia.org/wiki/Theory_of_Forms
class Pictogram {

  constructor(svg) {
    if (svg instanceof SVGElement && svg.id) {
      this.element = svg;

      // Prepares descriptive elements contributing to accessibility
      var title = this.title = svg.getElementsByTagName("title").item(0);
      var desc = this.desc = svg.getElementsByTagName("desc").item(0);

      if (title && !title.id) {
        title.id = svg.id + "-title";
      }

      if (desc && !desc.id) {
        desc.id = svg.id + "-desc";
      }

    } else {
      throw new Error("Invalid pictogram element");
    }
  }

  // Gets the IRI of the pictogram.
  getIRI() {
    return "#" + this.element.id;
  }

  // Gets the viewBox of the pictogram.
  getViewBox() {
    var svg = this.element;
    return (!!svg.viewBox.baseVal &&
      svg.viewBox.baseVal.width > 0) ? // Fix Webkit
      svg.viewBox.baseVal :
      svg.ownerSVGElement.viewBox.baseVal;
  }

}

export default Pictogram;
