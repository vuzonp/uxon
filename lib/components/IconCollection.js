import Collection from "./Collection.js";
import Icon from "./Icon.js";

// Singleton instance
let instance = null;

/**
 * Specific collection used for load the icons.
 *
 * This class, is a singleton which allows to load only one icon component
 * by html element.
 */
class IconCollection extends Collection {

  constructor() {
    super();
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  /**
   * Retrieves or generates an icon from an element.
   * @param {Element} element - Reference HTML Element of the icon.
   * @returns {Icon}
   */
  load(element) {
    if (!this.has(element)) {
      this.set(element, new Icon(element));
    }
    return this.get(element);
  }
}

export default IconCollection;
