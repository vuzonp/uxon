// Privates
const _wm = new WeakMap();

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

  // The class itself...
  const self = class Collection {

    // The constructor requires a component declaration.
    constructor() {
      _wm.set(this, new WeakMap());
    }

    // Clear the collection of components by removing properly each of them.
    clear() {
      _wm.get(this).forEach(fn);
      _wm.delete(this);
    }

    // Removes a component of the collection.
    delete(key) {
      if (this.has(key)) {
        const component = this.get(key);
        if ("remove" in component) {
          component.remove();
        }
      }
      return _wm.get(this).delete(key);
    }

    // Gets a component present in the collection.
    get(key) {
      return _wm.get(this).get(key);
    }

    // Checks if a component exists.
    has(key) {
      return _wm.get(this).has(key);
    }

    // Adds a new component to the collection.
    set(key, value) {
      _wm.get(this).set(key, value);
      return this;
    }

  };

  return self;

})();


export default Collection;
