import "es6-symbol";
import "weakmap";

import svgLoader from "./loader.js";
import Icon from "./components/Icon.js";
import Sprite from "./components/Sprite.js";
import Theme from "./components/Theme.js";

var callback = function callback() { };

const icons = Icon;

const initLoader = svgLoader;

// loads an external SVG file as sprite.
function load(loader, onFulfilled, onRejected) {
  if (!onRejected) { onRejected = callback; }

  if (typeof loader === "string") {
    loader = svgLoader(loader);
  } else if (!loader || !loader.request) {
    onRejected(new TypeError("Invalid Request"));
  }

  loader.onSuccess = function onSuccess(svg) {
    make(svg, onFulfilled, onRejected);
  };

  loader.onFailure = function onFailure(e) {
    onRejected(new TypeError(e));
  };

  loader.send();
}

function make(svg, onFulfilled, onRejected) {
  var theme;
  var autorun = false;

  if (!onFulfilled) {
    onFulfilled = callback;
    autorun = true;
  }

  if (!onRejected) { onRejected = callback; }

  try {
    var sprite = new Sprite(svg);
    theme = new Theme(sprite);
    onFulfilled(theme);
    if (autorun) {
      theme.render();
    }
  } catch (e) {
    onRejected(e);
  }
}

export { icons, initLoader, load, make };
