import "weakmap";
import svgLoader from "./loader.js";
import Icon from "./components/Icon.js";
import Pictogram from "./components/Pictogram.js";
import Sprite from "./components/Sprite.js";
import Theme from "./components/Theme.js";

/**
 * @typedef {Object} The Component classes used by the library
 */
const components = {
  Icon: Icon,
  Pictogram: Pictogram,
  Sprite: Sprite,
  Theme: Theme
};

/**
 * Loads a theme from an existing SVG element.
 * @param {SVGElement} svgElement - The SVG element used as sprite.
 * @param {Element} container - An element that delimits the implementation of the theme
 * @returns {Promise} A resolved function with a {@link Theme} object as argument.
 */
const make = function make(svgElement, container) {
  return new Promise(function(resolve, reject) {
    try {
      const sprite = new components.Sprite(svgElement);
      const theme = new components.Theme(sprite);
      resolve(theme, container);
    } catch(e) {
      reject(e);
    }
  });
};

// Loader
//------------------------------------------------------------------------------

/**
 * This function loads an external file as a sprite and creates a theme ready to use.
 * @param {string} url - The url or path of the svg file to download.
 * @param {Object} opts - The settings of the import.
 * @example import("./sprite.svg", {
 *  autorun: false,
 *  container: document.body,
 *  header: { "Accept-Language": "en-US" },
 *  sizeRange: {min: 16, max: 96}
 * }).then(function(theme) { /*...*\/ });
 * @returns {Promise} A resolved function with a {@link Theme} object as argument.
 */
const load = function loadSprite(url, opts) {
  return new Promise(function(resolve, reject) {
    try {
      // Initialize the loader.
      const loader = svgLoader(url);

      loader.onsuccess = function loadExternalSprite(svgElement) {
        make(svgElement, opts.container).then(function(theme) {
          if (opts.sizeRange) {
            theme.sizeRange = opts.sizeRange;
          }
          if (opts.autorun) {
            theme.render();
          }
          resolve(theme);
        }, function(e) {
          reject(e);
        })
      };

      loader.onerror = reject;
      if (opts.headers) {
        opts.headers.foreach(function(header, value) {
          loader.addHeader(header, value);
        });
      }

      loader.send();

    } catch(e) {
      reject(e);
    }
  });
};

/**
 *
 */
const autoload = function autoloadSprite(url) {
  return load(url, { autorun: true });
}

export {
  components,
  autoload,
  load,
  make
};
