// Loads external SVG files by detecting browser capabilities to achieve it.
// If successful, a callback function is called, with the root node of the SVG
// document in parameter. Else, an other callback function is called with an
// error object containing the failure message in parameter.

var errServer = "Unable to access resource";
var errSVG = "Invalid SVG file format";
var method = "GET";
var mime = "image/svg+xml";

// Generic empty callback function... in waiting the real users callbacks.
var callback = function() { };

// Checks if the request calls an external resource... or not.
function isCORS(url) {
  return (
      url.indexOf("http") >= 0 &&
      url.indexOf(location.hostname) < 0
  );
}

// Converts a well-formed SVG string to a DOM SVG node.
// (In theory, it is only used by IE9 & 10)
function textToSVG(str) {
  var svg = null;
  if (window.DOMParser) {
    var parser = new DOMParser();
    svg = parser.parseFromString(str, mime);
    var found = svg.getElementsByTagName("parsererror");
    return (
        (!found || !found.length || !found[0].childNodes.length) &&
        svg.documentElement instanceof SVGElement
    ) ?
    svg.documentElement :
    null;
  }

  return svg;
}

// Abstract loader combining the actions involving the other loaders.
var AbstractLoader = function(url) {
  this.cors = false;
  this.request = null;
  this.onRejected = callback;
  this.onFulfilled = callback;
  this.headers = [];
  this.url = encodeURI(url);
};

var _AbstractLoader = AbstractLoader.prototype = {

  // Adds a customized header to the request
  addHeader: function(prop, value) {
    var header = new Array(2);
    header[0] = prop + "";
    header[1] = value + "";
    this.headers.push(header);
    return this;
  },

  // Defines the actions to run after the loading.
  then: function(onFulfilled, onRejected) {
    if (typeof onFulfilled === "function") {
      this.onFulfilled = onFulfilled;
    }

    if (typeof onRejected === "function") {
      this.onRejected = onRejected;
    }
  },

  // Sends the request.
  // This method is specific to each loader, so it"s only declared here...
  send: function() {},

};

// Default loader using the XMLHttpRequest object.
// Used by Gecko, Webkit, >=IE10 (and IE9 for non-CORS requests).
var XhrLoader = function(url, cors) {
  AbstractLoader.call(this, url);
  this.cors = !!cors;
  var req = this.request = new XMLHttpRequest();
  req.open(method, this.url, true);
};

var _XhrLoader = XhrLoader.prototype = Object.create(_AbstractLoader);

_XhrLoader.constructor = XhrLoader;

// Implements the abstract method.
_XhrLoader.send = function() {

  var onRejectedCallback = this.onRejected;
  var onFulfilledCallback = this.onFulfilled;
  var xhr = this.request;

  // Prepares the request
  this.addHeader("Content-Type", mime);
  if ("overrideMimeType" in xhr) {
    xhr.overrideMimeType(mime);
  }

  if (!this.cors) {
    // For more compatibility with servers that had only a minimal
    // configuration of the CORS protocol, this custom header is only sent
    // in local requests.
    // You can force this header with the `addHeader(prop, value)` method if
    // necessary.
    this.addHeader("X-Requested-With", "XMLHttpRequest");
  }

  this.headers.forEach(function(header) {
    xhr.setRequestHeader(header[0], header[1]);
  });

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          var svg = null;

          // Gecko, Webkit, >=IE10
          // Because, it is still faster when it is possible...
          if (this.responseXML &&
              this.responseXML.documentElement &&
              "overrideMimeType" in xhr) {
            svg = this.responseXML.documentElement;
          } else { // IE 9, Webkit
            svg = textToSVG(this.responseText);
          }

          if (svg) {
            onFulfilledCallback(svg);
          } else {
            throw new TypeError(errSVG);
          }

        // The rejection callback is encapsulated in an exception to catch
        // any problems occured during the parsing of the svg document.
        } catch (e) {
          onRejectedCallback(e);
        }
      } else {
        onRejectedCallback(new Error(errServer));
      }
    }
  });

  xhr.addEventListener("error", function() {
    onRejectedCallback(new Error(errServer));
  });

  xhr.addEventListener("timeout", function() {
    onRejectedCallback(new Error(errServer));
  });

  xhr.send();
};

// Variant loader for old browsers (uses XDomainRequest).
// (Normally only used by IE9 in CORS requests)
var XdrLoader = function(url) {
  AbstractLoader.call(this, url);
  var req = this.request = new XDomainRequest();
  req.open(method, this.url);
};

var _XdrLoader = XdrLoader.prototype = Object.create(_AbstractLoader);

_XdrLoader.constructor = XdrLoader;

// Implements the abstract method.
_XdrLoader.send = function() {

  var onRejectedCallback = this.onRejected;
  var onFulfilledCallback = this.onFulfilled;
  var xdr = this.request;

  xdr.onload = function() {
    try {
      var svg = textToSVG(xdr.responseText);
      if (svg) {
        onFulfilledCallback(svg);
      } else {
        throw new TypeError(errSVG);
      }
    } catch (e) {
      onRejectedCallback(e);
    }
  };

  xdr.onerror = function() {
    onRejectedCallback(errServer);
  };

  xdr.ontimeout = function() {
    onRejectedCallback(new Error(errServer));
  };

  // Not tested, but I"ve got to take their word for it.
  // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
  setTimeout(function() { xdr.send(); }, 0);
};

// Dispatchs the request to the suitable loader
export default function svgLoader(url) {
  var cors = isCORS(url);
  if (!cors || ("withCredentials" in XMLHttpRequest.prototype)) {
    return new XhrLoader(url, cors);
  } else if (typeof XDomainRequest !== "undefined") { // <=IE10
    return new XdrLoader(url);
  } else {
    throw new Error("[Uxôn] Too old browser");
  }
}
