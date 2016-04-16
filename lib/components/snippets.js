import {createSVGElement} from "../misc/utils.js";

/** SVG Element used by icons */
const icon = (function() {
  const svg = createSVGElement("svg");
  svg.setAttribute("aria-hidden", "true");
  return svg;
})();

/** SVG connector used by icons for link pictograms */
const connector = (function() {
  const use = createSVGElement("use");
  return use;
})();

export default { icon, connector };
