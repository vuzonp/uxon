// Collection of components.
// Allows to collect many components of same class in using elements as keys.
const Collection = (function() {

  // Callback function used for remove each component.
  const fn = function clearCallback(component, key, mapObj) {
    if ("remove" in component) {
      component.remove();
    }
    mapObj.delete(key);
  };

  // @private {WeakMap} wm - Map of the components.
  const wm = Symbol("wm");

  // The class itself...
  const self = class Collection {

    // The constructor requires a component declaration.
    constructor() {
      this[wm] = new WeakMap();
    }

    // Clear the collection of components by removing properly each of them.
    clear() {
      this[wm].forEach(fn);
    }

    // Removes a component of the collection.
    delete(key) {
      if (this.has(key)) {
        const component = this.get(key);
        if ("remove" in component) {
          component.remove();
        }
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

    // Adds a new component to the collection.
    set(key, value) {
      this[wm].set(key, value);
      return this;
    }

  };

  return self;

})();


export default Collection;
