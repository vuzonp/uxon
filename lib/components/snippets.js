// import ns from "../misc/namespaces.js";
import {createSVGElement} from "../misc/utils.js";

const icon = (function() {
  const svg = createSVGElement("svg");
  svg.setAttribute("aria-hidden", "true");
  return svg;
})();

const connector = (function() {
  const use = createSVGElement("use");
  return use;
})();

export default { icon, connector };
