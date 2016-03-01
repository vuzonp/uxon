import {InvalidArgument} from "../errors.js";

// Collection of components.
// Allows to collect many components of same class in using elements as keys.
const Collection = (function() {

  // Callback function used for remove each component.
  const fn = function clearCallback(component, key, mapObj) {
    component.remove();
    mapObj.delete(key);
  };

  // @private {Component} component - Collected component.
  const component = Symbol("component");
  // @private {WeakMap} wm - Map of the components.
  const wm = Symbol("wm");

  // The class itself...
  const self = class Collection {

    // The constructor requires a component declaration.
    constructor(component) {
      if (!("remove" in component.prototype)) {
        throw new InvalidArgument(
          "component must implements a `remove` method."
        );
      }
      this[component] = component;
      this[wm] = new WeakMap();
    }

    // Clear the collection of components by removing properly each of them.
    clear() {
      this[wm].forEach(fn);
    }

    // Removes a component of the collection.
    delete(key) {
      if (this.has(key)) {
        this.get(key).remove();
      }
      return this[wm].delete(key);
    }

    // Gets a component present in the collection.
    get(key) {
      return this[wm].get(key);
    }

    // Checks if a component exists.
    has(key) {
      return this[wm].has(key);
    }

    // Ajoute un nouveau composant à la collection.
    set(key, value) {
      if (value instanceof this[component]) {
        this[wm].set(key, value);
      } else {
        throw new InvalidArgument("Invalid component.");
      }
      return this;
    }

  };

  return self;

})();


export default Collection;
