/**
 * Private weakmaps used by the Collection objects.
 */
const _wm = new WeakMap();

/**
 * Callback function called by a collection for remove each component.
 * @param {object} component - The focused component .
 * @param {object} key - The component key
 * @param {WeakMap} mapObj - The object being traversed
 */
function clearCallback(component, key, mapObj) {
  if ("remove" in component) {
    component.remove();
  }
  mapObj.delete(key);
}

/**
 * Collection that maps object to components.
 */
class Collection {

  constructor() {
    _wm.set(this, new WeakMap());
  }

  /**
   * Clears the collection of components by removing properly each of them.
   */
  clear() {
    _wm.get(this).forEach(clearCallback);
    // _wm.delete(this);
  }

  /**
   * Removes any component associated to the key.
   * @param {!object} key - The key of the component to remove.
   * @returns {boolean} Returns true if a component has been removed successfully.
   */
  delete(key) {
    if (this.has(key)) {
      const component = this.get(key);
      if ("remove" in component) {
        component.remove();
      }
    }
    return _wm.get(this).delete(key);
  }

  /**
   * Returns a specified component from the collection.
   * @param {!object} key - The key of the component to return.
   * @returns {object|undefined} The component associated with the key.
   */
  get(key) {
    return _wm.get(this).get(key);
  }

  /**
   * Returns a boolean indicating whether a component with the specified key
   * exists in the Collection object or not.
   * @param {!object} key - The key of the component to test.
   * @returns {boolean} Returns `true` if an element with the specified key exists; otherwise `false`.
   */
  has(key) {
    return _wm.get(this).has(key);
  }

  /**
   * Adds a new component.
   * @param {!object} key - The key of the component to add.
   * @param {!object} component - The compone to add.
   * @returns {Collection} The Collection object.
   */
  set(key, component) {
    _wm.get(this).set(key, component);
    return this;
  }

}

export default Collection;
