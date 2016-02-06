import {$} from "./misc/utils.js";
import {InvalidSVGDocument, NotImplemented, RequestError} from "./errors.js";

// Converts a well-formed SVG string to a DOM SVG node.
// (In theory, it is only used by IE9 & 10.)
function textToSVG(str) {
  let svg = null;
  if (window.DOMParser) {
    const parser = new DOMParser();
    svg = parser.parseFromString(str, "image/svg+xml");
    const err = $("parsererror", svg);
    if (err && err.length > 0) {
      throw new InvalidSVGDocument(err.textContent);
    }
  } else {
    throw new NotImplemented("DOMParser");
  }
  return svg;
}

// Generic callback used for erroneous requests.
const onFailureCallback = function onFailureCallback(err) {
  throw err;
};

// Generic callback used for successful requests.
const onSuccessCallback = function onSuccessCallback() {
  // Does Nothing...
};

// Abstract loader combining the actions involving the other loaders.
class Loader {

  constructor(url) {
    this.cors = false;
    this.headers = [];
    this.method = "GET";
    this.mime = "image/svg+xml";
    this.onFailure = onFailureCallback;
    this.onSuccess = onSuccessCallback;
    this.request = null;
    this.url = encodeURI(url);
  }

  // Adds a customized header to the request
  addHeader(prop, value) {
    this.headers.push([prop + "", value + ""]);
  }

  // Sends the request. (Abstract)
  send() {
    throw new NotImplemented("Loader", "send");
  }

}

// Default loader.
// Used by Gecko, Webkit, >=IE10 (and IE9 for non-CORS requests).
class Xhr extends Loader {

  constructor(url, cors) {
    super(url);
    this.cors = !!cors;
    this.request = new XMLHttpRequest();
    this.request.open(this.method, this.url, true);
  }

  // Sends the request.
  send() {

    const onSuccess = this.onSuccess;
    const onFailure = this.onerror;
    const xhr = this.request;

    function xhrError() {
      onFailure(new RequestError(xhr.statusText));
    }

    // Prepares the request
    this.addHeader("Content-Type", this.mime);
    if ("overrideMimeType" in xhr) {
      xhr.overrideMimeType(this.mime);
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

    xhr.onload = function() {
      if (this.status === 200) {
        try {
          let svg = null;

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
            onSuccess(svg);
          } else {
            throw new InvalidSVGDocument();
          }

        } catch(e) {
          onFailure(e);
        }
      } else {
        xhrError();
      }
    };

    xhr.onerror = xhrError;
    xhr.ontimeout = xhrError;
    xhr.send(null);

  }

}

// Variant loader for old browsers (uses XDomainRequest).
// (Normally only used by IE9 in CORS requests)
class Xdr extends Loader {

  constructor(url) {
    super(url);
    this.cors = true;
    this.request = new XDomainRequest();
    this.request.open(this.method, this.url);
  }

  // Sends the request.
  send() {

    const onSuccess = this.onSuccess;
    const onFailure = this.onerror;
    const xdr = this.request;

    function xdrError() {
      onFailure(new RequestError(xdr.statusText));
    }

    xdr.onload = function() {
      try {
        const svg = textToSVG(xdr.responseText);
        if (svg) {
          onSuccess(svg);
        } else {
          throw new InvalidSVGDocument();
        }
      } catch (e) {
        onFailure(e);
      }
    };

    xdr.onerror = xdrError;
    xdr.ontimeout = xdrError;

  }

}

// Checks if the url is hosted on the same domain than the page.
function checksCORS(url) {
  const matches = /^https?:\/\/([^/]+)\/|:/.exec(url);
  return (matches && matches[1] !== location.host);
}

// Dispatchs the request to the suitable loader
function svgLoader(url) {
  const isCORS = checksCORS(url);
  if (!isCORS || ("withCredentials" in XMLHttpRequest.prototype)) {
    // Uses XMLHttpRequest for local requests or browser available with CORS.
    return new Xhr(url, isCORS);
  } else if (typeof XDomainRequest !== "undefined") {
    // The oldest browsers can't use CORS, but implement XDomainRequest
    // which can do the same thing with less features.
    return new Xdr(url);
  } else {
    // If none mechanism to perform the request is available...
    throw new NotImplemented("XDomainRequest");
  }
}

export default svgLoader;
