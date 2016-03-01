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

class DomainException extends UxonException {
  constructor(message) {
    super(message);
  }
}

// Exception thrown if an element is not of the expected type.
export class InvalidArgument extends DomainException {
  constructor(message) {
    super(message);
  }
}

// Exception thrown if an element is not of the expected type.
export class InvalidElement extends InvalidArgument {
  constructor(expected, badValue) {
    let bad = (badValue && badValue.name) ? badValue.name : (typeof badValue);
    super("Invalid DOM Element: `" + expected + "` expected but `" + bad + "` received.");
  }
}

export class InvalidSVGDocument extends DomainException {
  constructor(message) {
    super(message);
  }
}

// Exception thrown if an abstract function is directly called.
export class NotImplemented extends UxonException {
  constructor(classname, method) {
    const name = (method) ?
      classname + ":" + method + "()" :
      classname;
    super("Not Callable Function `" + name + "`");
  }
}

// Exception thrown when a request encounters a problem.
export class RequestError extends UxonException {
  constructor(status) {
    super("The request could not be completed - status code received: " + status || "???");
  }
}
