import {$} from "./misc/utils.js";
import {InvalidSVGDocument, NotImplemented, RequestError} from "./errors.js";

/**
 * Converts a well-formed SVG string to a DOM SVG node.
 * (In theory, it is only used by IE9 & 10.)
 * @param {string} str - A Well-formed SVG string.
 * @returns {SVGDocument} The DOM object corresponding to the input string.
 * @external {DOMParser} https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */
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

/** Generic callback used for failed requests. */
const _onErrorCb = function onErrorCb(err) {
  throw err;
};

/** Generic callback used for successful requests. */
const _onSuccessCb = function onSuccessCb() {
  // Does Nothing...
};

// Private attributes
const _errMsg = "Callback argument must be a function.";
const _method = "GET";
const _mime = "image/svg+xml";

const _cors = new WeakMap();
const _headers = new WeakMap();
const _onerror = new WeakMap();
const _onsuccess = new WeakMap();
const _request = new WeakMap();
const _url = new WeakMap();

/**
 * Abstract loader combining the actions involving the other loaders.
 */
class Loader {

  /**
   * @param {string} url - The path to the SVG file to download.
   */
  constructor(url) {
    _headers.set(this, []);
    _onerror.set(this, _onErrorCb);
    _onsuccess.set(this, _onSuccessCb);
    _url.set(this, encodeURI(url));

    // ReadOnly properties
    Object.defineProperties(this, {
      request: { get: function() {
        return _request.get(this);
      }},
      url: { get: function() {
        return _url.get(this);
      }}
    });
  }

  /** @type {function} */
  set onerror(callback) {
    if (typeof callback === "function") {
      _onerror.set(this, callback);
    } else {
      throw new InvalidArgument(_errMsg);
    }
  }

  /** @type {function} */
  get onerror() {
    return _onerror.get(this);
  }

  /** @type {function} */
  set onsuccess(callback) {
    if (typeof callback === "function") {
      _onsuccess.set(this, callback);
    } else {
      throw new InvalidArgument(_errMsg);
    }
  }

  /** @type {function} */
  get onsuccess() {
    return _onsuccess.get(this);
  }

  /**
   * Adds a customized header to the request
   */
  addHeader(prop, value) {
    _headers.get(this).push([prop + "", value + ""]);
  }

  /**
   * Sends the request. (Abstract)
   * @abstract
   */
  send() {
    throw new NotImplemented("Loader", "send");
  }

}

/**
 * Default loader used by Gecko, Webkit, >=IE10 (and IE9 for non-CORS requests).
 */
class Xhr extends Loader {

  /**
   * @param {string} url - The path to the SVG file to download.
   * @param {boolean} cors - `true` if the resource is hosted from another domain.
   */
  constructor(url, cors) {
    super(url);
    const request = new XMLHttpRequest();
    request.open(_method, this.url, true);
    _cors.set(this, !!cors);
    _request.set(this, request);
  }

  send() {

    const onSuccess = _onsuccess.get(this);
    const onError = _onerror.get(this);
    const xhr = this.request;

    function xhrError() {
      onError(new RequestError(xhr.statusText));
    }

    // Prepares the request
    this.addHeader("Content-Type", _mime);
    if ("overrideMimeType" in xhr) {
      xhr.overrideMimeType(_mime);
    }

    if (!_cors.get(this)) {
      // For more compatibility with servers that had only a minimal
      // configuration of the CORS protocol, this custom header is only sent
      // in local requests.
      // You can force this header with the `addHeader(prop, value)` method if
      // necessary.
      this.addHeader("X-Requested-With", "XMLHttpRequest");
    }

    _headers.get(this).forEach(function(header) {
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
          onError(e);
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

  /**
   * @param {string} url - The path to the SVG file to download.
   */
  constructor(url) {
    super(url);
    const request = new XDomainRequest();
    request.open(this.method, this.url);
    _cors.set(this, !!cors);
    _request.set(this, request);
  }

  send() {

    const onSuccess = this.onSuccess;
    const onError = this.onError;
    const xdr = this.request;

    function xdrError() {
      onError(new RequestError(xdr.statusText));
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
        onError(e);
      }
    };

    xdr.onerror = xdrError;
    xdr.ontimeout = xdrError;

  }

}

/**
 * Checks if the url is hosted on the same domain than the page.
 * @param {string} url - The url to check.
 * @returns {boolean} `true` if the request is CORS, otherwise returns `false`.
 */
function checksCORS(url) {
  const matches = /^https?:\/\/([^/]+)\/|:/.exec(url);
  return (matches && matches[1] !== location.host);
}

/**
 * Initialize a request
 * @param {string} url - The url of the SVG file to download.
 * @returns {Loader} A Loader object selected between {@link Xhr} and {@link Xdr}
 */
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
