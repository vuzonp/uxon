/**
 * Customized Exception thrown by the Uxôn library.
 */
class UxonException extends Error {
  /**
   * @param {string} message - The exception message.
   */
  constructor(message) {
    super(message);
    /** @type {string} */
    this.name = this.constructor.name;
    /** @type {string} */
    this.message = message + "";
  }

  /**
   * Format the error in a log string for output.
   * @returns {string}
   */
  toString() {
    return "[error][Uxôn → " + this.name + "] " + this.message;
  }
}

/**
 * Exception thrown if a value does not adhere to a defined valid data domain.
 */
class DomainException extends UxonException {
  /**
   * @param {string} message - The exception message.
   */
  constructor(message) {
    super(message);
  }
}

/**
 * Exception thrown if an argument is not of the expected type.
 */
export class InvalidArgument extends DomainException {
  /**
   * @param {string} message - The exception message.
   */
  constructor(message) {
    super(message);
  }
}

/**
 * Exception thrown if an element is not of the expected type.
 */
export class InvalidElement extends InvalidArgument {
  /**
   * @param {string} expected - The type of element expected.
   * @param {?Object} badValue - The perceived value in place of the expected.
   */
  constructor(expected, badValue) {
    let bad = (badValue && badValue.name) ? badValue.name : (typeof badValue);
    super("Invalid DOM Element: `" + expected + "` expected but `" + bad + "` received.");
  }
}

/**
 * Exception thrown when a SVG document is malformed
 * or that it can not be converted to object.
 */
export class InvalidSVGDocument extends DomainException {
  /**
   * @param {string} message - The exception message.
   */
  constructor(message) {
    super(message);
  }
}

/**
 * Exception thrown if an abstract function is directly called.
 */
export class NotImplemented extends UxonException {
  /**
   * @param {string} classname - The class name that owns the method..
   * @param {string} method - The method/function name that is not implemented.
   */
  constructor(classname, method) {
    const name = (method) ?
      classname + ":" + method + "()" :
      classname;
    super("Not Callable Function `" + name + "`");
  }
}

/**
 * Exception thrown when a request encounters a problem.
 */
export class RequestError extends UxonException {
  /**
   * @param {number} status - The HTTP status code of the response.
   */
  constructor(status) {
    super("The request could not be completed - status code received: " + status || "???");
  }
}

/**
 * Exception thrown if an error which can only be found on runtime occurs.
 */
export class RuntimeException extends UxonException {
  /**
   * @param {string} message - The exception message.
   */
  constructor(message) {
    super(message);
  }
}
