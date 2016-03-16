import {InvalidArgument} from "../errors.js";
import {$body, $$, isInPage} from "../misc/utils.js";
import IconCollection from "./IconCollection.js";
import Sprite from "./Sprite.js";

//------------------------------------------------------------------------------

const icons = new IconCollection();

//------------------------------------------------------------------------------

/*
 * Calculates the difference value between two numbers (helper).
 * @param {number} n1
 * @param {number} n2
 * @returns {number}
 */
function diff(n1, n2) {
  return Math.max(n1, n2) - Math.min(n1, n2);
}

/*
 * Checks whether a value is in the range
 * @param {number} value - The value to verify.
 * @param {number} min - The minimal value allowed.
 * @param {number} max - The max value allowed.
 */
function isInRange(value, min, max) {
  return (value >= min && value <= max);
}

/*
 * Structural object that defines a allowed range size for the icons.
 * @typedef {Object}
 * @property {number} [min=-1]
 * @property {max} [max=Number.MAX_VALUE]
 */
function SizeRange(min, max) {
  this.min = parseInt(min);
  this.max = parseInt(max);

  if (isNaN(this.min)) {
    this.min = -1;
  } if (isNaN(this.max)) {
    this.max = Number.MAX_VALUE;
  }
}

/*
 * Algorithm to determine the best choice between two sprites.
 * If an icon can uses many themes, this function selects the more adapted
 * by comparing the sizes ranges, then the nearest container of the icon.
 * @param {number} refSize - The size of the icon
 * @param {Theme} theme1 - The newest candidate Theme object.
 * @param {Theme} theme2 - The already assigned Theme object.
 * @returns {Theme} The best theme between the two compared objects.
 */
function selectTheme(refSize, theme1, theme2) {
  if (!theme1) { return theme2; }
  if (!theme2) { return theme1; }

  var r1 = theme1.sizeRange;
  var r2 = theme2.sizeRange;
  var d1 = diff(refSize, (r1[0] + r1[1]) / 2);
  var d2 = diff(refSize, (r2[0] + r2[1]) / 2);

  if (d1 === d2) {
    // Same size range, uses containers position in the tree DOM
    return (theme2.container.contains(theme1.container)) ? theme1 : theme2;
  } else if (d1 > d2) { // theme2 is better
    return theme2;
  } else { // theme1 is better
    return theme1;
  }
}

/*
 * Verifies if a theme is applicable or not.
 */
const verifyTheme = (function() {
  const cache = new WeakMap();
  const fn = function verifyTheme(icon, theme) {
    const refSize = icon.getRefSize();
    if (isInRange(refSize, theme.sizeRange.min, theme.sizeRange.max) &&
        selectTheme(refSize, theme, cache.get(icon)) === theme ) {
      cache.set(icon, theme);
      return true;
    }
    return false;
  };
  return fn;
})();

// Private attributes
const _container = new WeakMap();
const _sizeRange = new WeakMap();
const _sprite = new WeakMap();

/**
 * A theme is a component that performs the connection between a sprite
 * and a collection of icons.
 */
class Theme {

  /**
   * @param {!Sprite} sprite - The sprite used by the Theme object.
   * @param {HTMLElement} container - An element that delimits the implementation of the theme
   * @throws {InvalidArgument} When the Sprite object is invalid.
   */
  constructor(sprite, container) {
    if (!(sprite instanceof Sprite)) {
      throw new InvalidArgument("must be a Sprite Component");
    }

    _container.set(this, isInPage(container) ? container : $body);
    _sprite.set(this, sprite);
    _sizeRange.set(this, new SizeRange());

    // ReadOnly properties
    Object.defineProperties(this, {
      container: { get: function() { return _container.get(this); }},
      sprite: { get: function() { return _sprite.get(this); }}
    });
  }

  /**
   * @type {Object}
   * @property {number} min
   * @property {number} max
   */
  get sizeRange() {
    return _sizeRange.get(this);
  }

  /**
   * @type {Object}
   * @property {number} min
   * @property {number} max
   */
  set sizeRange(value) {
    let min = -1;
    let max = -1;
    if (Array.isArray(value)) {
      min = value[0];
      max = value[1];
    } else {
      min = value.min || -1;
      max = value.max || -1;
    }
    _sizeRange.set(this, new SizeRange(min, max));
  }

  /**
   * Creates a copy of the Theme.
   * @returns {Theme} A duplicated Theme.
   */
  clone() {
    const theme = new Theme(this.sprite, this.container);
    theme.sizeRange = this.sizeRange;
    return theme;
  }

  /**
   * Displays the icons in the document.
   */
  render() {
    $$("*[data-icon]", this.container).forEach(function drawIcon(element) {
      const icon = icons.load(element);
      // Vérifie si la taille de l'icône convient au thème
      if (verifyTheme(icon, this)) {
        // Récupère le pictogramme attendu par l'icône auprès de la sprite
        const pictogram = this.sprite.findPictogram(icon.meta.get("icon"));
        // Dessine l'icône
        icon.draw(pictogram);
      }
    }, this);
  }

}

export default Theme;
