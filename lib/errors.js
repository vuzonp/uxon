// Customized Exception.
class UxonException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message + "";
  }
  toString() {
    return "[error][Uxôn → " + this.name + "] " + this.message;
  }
}

// Exception thrown if an element is not of the expected type.
export class InvalidElement extends UxonException {
  constructor(expected, badValue) {
    let bad = (badValue && badValue.name) ? badValue.name : (typeof badValue);
    super("Invalid DOM Element: `" + expected + "` expected but `" + bad + "` data received.");
  }
}
