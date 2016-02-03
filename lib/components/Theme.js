import { $$, $body, isInPage } from "../misc/utils.js";
import Icon from "./Icon";

var warehouse = [];

// Checks if the size of the icon allows the use of a theme
function checkSize(theme, icon) {
  var range = theme.sizeRange;
  var size = icon.getRefSize();
  return (
      (range[0] === -1 || size >= range[0]) &&
      (range[1] === -1 || size <= range[1])
  );
}

// Algorithm to determine the best choice between two sprites.
// If an icon can uses many themes, this function selects the more adapted
// by comparing the sizes ranges, then the nearest container of the icon.
function selectTheme(icon, recentTheme, oldTheme) {
  if (!oldTheme) { return recentTheme; }

  var r1 = recentTheme.sizeRange;
  var r2 = oldTheme.sizeRange;
  var ref = icon.getRefSize();
  var d1 = diff(ref, (r1[0] + r1[1]) / 2);
  var d2 = diff(ref, (r2[0] + r2[1]) / 2);

  if (d1 === d2) {
    // Same size range, uses containers position in the tree DOM
    return (oldTheme.container.contains(recentTheme.container)) ?
        recentTheme :
        oldTheme;
  } else if (d1 > d2) {
    // oldTheme is better
    return oldTheme;
  } else {
    // recentTheme is better
    return recentTheme;
  }
}

// Calculates the difference value between two numbers (helper).
function diff(n1, n2) {
  return Math.max(n1, n2) - Math.min(n1, n2);
}

class Theme {

  constructor(sprite) {
    this.container = $body;
    this.sizeRange = new Array(2);
    this.sprite = sprite;

    this.id = (warehouse.push(this)) - 1;
    this.setSizeRange(-1, -1);
  }

  // Allows to duplicate a theme.
  clone() {
    var theme = new Theme(this.sprite);
    theme.setSizeRange(this.sizeRange[0], this.sizeRange[1]);
    theme.setContainer(this.container);
    return theme;
  }

  // Applies a callback function on each icons controlled by the theme.
  forEachIcons(callback, thisArg) {
    $$("[data-icon][data-theme-id='" + this.id + "']", this.container).forEach(function(element) {
      callback.call(thisArg, Icon.load(element));
    });
  }

  // Returns an array of icons which use the same pictogram
  getIconsByName(name) {
    var icons = [];
    $$("[data-icon='" + name + "'][data-theme-id='" + this.id + "']", this.container).forEach(function(element) {
      icons.push(Icon.load(element));
    });

    return icons;
  }

  // Displays the icons in the document.
  render() {
    var icon;
    var pictogram;
    var _this;

    // Selects all the icons from the container element
    $$("[data-icon]", this.container).forEach(function(element) {
      icon = Icon.load(element);
      _this = this;

      // Checks if the icon is available with the theme
      if (checkSize(this, icon)) {
        if (icon.meta.has("theme-id")) {
          _this = selectTheme(this, warehouse[icon.meta.get("theme-id")]);
        }

        if (_this === this) {
          icon.meta.set("theme-id", this.id);
          pictogram = this.sprite.find(icon.meta.get("icon"));
          if (pictogram) {
            icon.draw(pictogram);
          }
        }
      }
    }, this);
  }

  // Changes the size range of the theme.
  setSizeRange(min, max) {
    this.sizeRange[0] = min | 0;
    this.sizeRange[1] = max | 0;
  }

  // Changes the container of the theme
  // A container is the root element of a theme, only the icons contained in
  // this element can use the theme.
  setContainer(element) {
    if (element && element.nodeType && isInPage(element)) {
      this.container = element;
      return true;
    }

    return false;
  }

}

export default Theme;
