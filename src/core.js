/* Copyright (c) 2015-2016 Thomas Girard (http://www.thomasgirard.fr/) - uxon v.1.0.0-rc.1 - License: MIT */

(function() {

  'use strict';

  if (!self.SVGElement) { return; } // Too old browser.

  // Simple shortcut...
  var $body = document.body;

  // XML namespaces:
  var nsSVG = 'http://www.w3.org/2000/svg';
  var nsXLINK = 'http://www.w3.org/1999/xlink';

  // Generic empty callback function... in waiting the real users callbacks.
  var callback = function() { };

  // Helpers
  //----------------------------------------------------------------------------

  // DOM selectors. The results are returned in arrays.
  // http://lea.verou.me/2015/04/jquery-considered-harmful/
  function $(selectors, container) {
    return (typeof selectors === 'string') ?
            (container || document).querySelector(selectors) :
            null;
  }

  function $$(selectors, container) {
    return [].slice.call((container || document).querySelectorAll(selectors));
  }

  // Checks to see if an element is in the page's body.
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
  function isInPage(node) {
    return (node === $body) ? false : $body.contains(node);
  }

  // Assign a css class to a html element.
  // This function is mainly used for maintain the compatibility with IE9.
  function addClass(element, cname) {
    if ('classList' in element) {
      element.classList.add(cname);
    } else { // IE9
      element.className.baseVal += ' ' + cname;
    }
  }

  // Helper for remove a css class
  // http://stackoverflow.com/questions/2155737/remove-css-class-from-element-with-javascript-no-jquery#2155787
  // function delClass(element, cname) {
  //     if ("classList" in element) {
  //         element.classList.remove(cname);
  //     } else {
  //         element.className.baseVal.replace(
  //             new RegExp("(?:^|\\s)" + cname + "(?!\\S)"),
  //             ""
  //         );
  //     }
  // }

  // CRUD for handle data-attributes.
  // Attributes methods are supposed to be slow, but after few benchmarks, it
  // is not a problem here. Moreover, it is IE9 compatible...
  var MetaData = (function() {

    var prefix = 'data-';

    var Data = function(element) {
      this.element = element;
    };

    Data.prototype = {

      has: function(key) {
        return this.element.hasAttribute(prefix + key);
      },

      get: function(key) {
        return this.element.getAttribute(prefix + key);
      },

      set: function(key, value) {
        return this.element.setAttribute(prefix + key, value);
      },

      remove: function(key) {
        return this.element.removeAttribute(prefix + key);
      },

    };

    return Data;

  })();

  // Loads external SVG files by detecting browser capabilities to achieve it.
  // If successful, a callback function is called, with the root node of the SVG
  // document in parameter. Else, an other callback function is called with an
  // error object containing the failure message in parameter.
  var svgLoader = (function() {

    var errServer = 'Unable to access resource';
    var errSVG = 'Invalid SVG file format';
    var method = 'GET';
    var mime = 'image/svg+xml';

    // Checks if the request calls an external resource... or not.
    function isCORS(url) {
      return (
          url.indexOf('http') >= 0 &&
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
        var found = svg.getElementsByTagName('parsererror');
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
        header[0] = prop + '';
        header[1] = value + '';
        this.headers.push(header);
        return this;
      },

      // Defines the actions to run after the loading.
      then: function(onFulfilled, onRejected) {
        if (typeof onFulfilled === 'function') {
          this.onFulfilled = onFulfilled;
        }

        if (typeof onRejected === 'function') {
          this.onRejected = onRejected;
        }
      },

      // Sends the request.
      // This method is specific to each loader, so it's only declared here...
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
      this.addHeader('Content-Type', mime);
      if ('overrideMimeType' in xhr) {
        xhr.overrideMimeType(mime);
      }

      if (!this.cors) {
        // For more compatibility with servers that had only a minimal
        // configuration of the CORS protocol, this custom header is only sent
        // in local requests.
        // You can force this header with the `addHeader(prop, value)` method if
        // necessary.
        this.addHeader('X-Requested-With', 'XMLHttpRequest');
      }

      this.headers.forEach(function(header) {
        xhr.setRequestHeader(header[0], header[1]);
      });

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            try {
              var svg = null;

              // Gecko, Webkit, >=IE10
              // Because, it is still faster when it is possible...
              if (this.responseXML &&
                  this.responseXML.documentElement &&
                  'overrideMimeType' in xhr) {
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

      xhr.addEventListener('error', function() {
        onRejectedCallback(new Error(errServer));
      });

      xhr.addEventListener('timeout', function() {
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

      // Not tested, but I've got to take their word for it.
      // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
      setTimeout(function() { xdr.send(); }, 0);
    };

    // Dispatchs the request to the suitable loader
    var loader = function(url) {
      var cors = isCORS(url);
      if (!cors || ('withCredentials' in XMLHttpRequest.prototype)) {
        return new XhrLoader(url, cors);
      } else if (typeof XDomainRequest !== 'undefined') { // <=IE10
        return new XdrLoader(url);
      } else {
        throw new Error('[Uxôn] Too old browser');
      }
    };

    return loader;

  })();

  // Toolkit Widgets
  //----------------------------------------------------------------------------

  // Represents a SVG sprite / Map of pictograms.
  var Sprite = (function() {

    var counter = 0;

    // Adds a prefix to the DOM identifiers of pictograms
    function prefix(element, str) {
      var pictograms = {};
      element.id = str;
      $$('symbol[id], g[id]', element).forEach(function(child) {
        child.id = [str, child.id].join('-');
        pictograms[child.id] = new Pictogram(child);
      });

      $$('use', element).forEach(function(use) {
        use.setAttributeNS(
            nsXLINK,
            'href',
            '#' + str + '-' + use.getAttributeNS(nsXLINK, 'href').slice(1)
        );
      });

      return pictograms;
    }

    // The public implementation of the class.
    var Sprite = function(svg) {
      if (!(svg instanceof SVGElement)) {
        throw new TypeError('Invalid sprite element');
      }

      // Do not display the sprite.
      svg.setAttribute('aria-hidden', true);
      svg.removeAttribute('height');
      svg.removeAttribute('width');
      addClass(svg, 'uxon');
      addClass(svg, 'uxon-sprite'); // a visually-hidden class.

      // Appends the element at the start of the document's body.
      // https://code.google.com/p/chromium/issues/detail?id=349175
      if (!isInPage(svg)) {
        $body.insertBefore(svg, $body.firstChild);
      }

      this.element = svg;
      this.pictograms = prefix(svg, 'uxon' + counter++);
    };

    Sprite.prototype = {

      // Creates a copy of the sprite.
      clone: function(prefix) {
        var svg = this.element.cloneNode(true);
        var sprite = new Sprite(svg);
        sprite.prefix(prefix);
        return sprite;
      },

      // Checks if the sprite contains a pictogram.
      has: function(id) {
        return (
            this.pictograms[id] &&
            this.pictograms[id] instanceof Pictogram
        );
      },

      // Searchs and finds a pictogram with the name of the pictogram.
      find: function(name) {
        var element = $('g[id$=' + name + '], symbol[id$=' + name + ']', this.element);
        return (element) ? this.get(element.id) : null;
      },

      // Gets a pictogram.
      get: function(id) {
        return this.pictograms[id] || null;
      },

      // Removes a pictogram.
      remove: function(id) {
        if (this.has(id)) {
          this.pictograms[id].parentNode.removeChild(this.pictograms[id]);
          this.pictograms[id] = null;
          return true;
        }

        return false;
      },

      // Updates the cache of pictograms.
      update: function() {
        this.pictograms = {};
        $$('symbol[id], g[id]', this.element).forEach(function(child) {
          this.pictograms[child.id] = new Pictogram(child);
        }, this);
      },

    };

    return Sprite;

  })();

  // Visual reference of icons.
  // Contributor: Plato
  // https://en.wikipedia.org/wiki/Theory_of_Forms
  var Pictogram = function(svg) {
    if (svg instanceof SVGElement && svg.id) {
      this.element = svg;

      // Prepares descriptive elements contributing to accessibility
      var title = this.title = svg.getElementsByTagName('title').item(0);
      var desc = this.desc = svg.getElementsByTagName('desc').item(0);

      if (title && !title.id) {
        title.id = svg.id + '-title';
      }

      if (desc && !desc.id) {
        desc.id = svg.id + '-desc';
      }

    } else {
      throw new Error('Invalid pictogram element');
    }
  };

  Pictogram.prototype = {

    // Gets the IRI of the pictogram.
    getIRI: function() {
      return '#' + this.element.id;
    },

    // Gets the viewBox of the pictogram.
    getViewBox: function() {
      var svg = this.element;
      return (!!svg.viewBox.baseVal &&
              svg.viewBox.baseVal.width > 0) ? // Fix Webkit
          svg.viewBox.baseVal :
          svg.ownerSVGElement.viewBox.baseVal;
    },

  };

  // Represents the displayed icons.
  var Icon = (function() {

    var warehouse = [];
    var key = 'uxon-id';

    // Moves the aria properties of an element to an other element
    function moveAriaProps(ref, target) {
      var attr;
      var attrs = ref.attributes;
      var n = attrs.length - 1;
      for (; n > -1; --n) {
        attr = attrs[n];
        if (attr.nodeName.indexOf('aria-') > -1) {
          target.setAttribute(attr.nodeName, attr.value);
          ref.removeAttribute(attr.nodeName);
        }
      }
    }

    // Connectors template.
    var tplConnector = (function() {
      var svg = document.createElementNS(nsSVG, 'use');
      svg.setAttributeNS(
          nsXLINK,
          'href',
          '#empty'
      );
      return svg;
    })();

    // SVG icons template.
    var tplShadow = (function() {
      var svg = document.createElementNS(nsSVG, 'svg');
      svg.className.baseVal = 'uxon uxon-icon';
      svg.setAttribute('role', 'img');
      return svg;
    })();

    function createIcon(element, meta) {
      var id = warehouse.push(new Icon(element, meta));
      meta.set(key, --id);
      return warehouse[id];
    }

    // The public implementation of the class.
    var Icon = function(element, meta) {
      if (!element.parentNode) {
        throw new Error("Icon's element must have a parent node");
      }

      // Makes the svg icon in clonning pre-defined elements.
      this.connector = tplConnector.cloneNode();
      this.element = element;
      this.meta = meta;
      var shadow = this.shadow = tplShadow.cloneNode();

      // Accessibility: specifies the element as an image
      // see: http://www.w3.org/wiki/SVG_Accessibility/ARIA_roles_for_graphics#icon
      // see: http://www.w3.org/TR/wai-aria/roles
      moveAriaProps(element, shadow);
      element.setAttribute('aria-hidden', 'true');

      // Appends the svg in the document
      shadow.appendChild(this.connector);
      this.element.parentNode.insertBefore(
          shadow,
          element.nextSibling
      );
    };

    Icon.prototype = {

      // Generates the icon
      draw: function(pictogram) {
        if (!(pictogram instanceof Pictogram)) {
          throw new TypeError('Invalid pictogram');
        }

        this.connector.setAttributeNS(
            nsXLINK,
            'xlink:href',
            '#' + pictogram.element.id
        );

        // Force the viewBox attribute. In principle it is not necessary but in
        // reality, the display is buggy on most browsers without it.
        var box = pictogram.getViewBox();
        this.setViewBox(
            box.x,
            box.y,
            box.width,
            box.height
        );

        // Adds accessibility informations
        if (pictogram.title && !this.shadow.hasAttribute('aria-label')) {
          this.shadow.setAttribute('aria-labelledby', pictogram.title.id);
        }

        if (pictogram.desc) {
          this.shadow.setAttribute('aria-describedby', pictogram.desc.id);
        }

        // Applies effects.
        if (this.meta.has('rotate')) {
          this.rotate(this.meta.get('rotate'));
        }

        if (this.meta.has('flip-x')) {
          this.flipX();
        }

        if (this.meta.has('flip-y')) {
          this.flipY();
        }

        if (this.meta.has('translate')) {
          this.translate(this.meta.get('translate').split(','));
        }

        if (this.meta.has('matrix')) {
          this.matrix(this.meta.get('matrix').split(','));
        }

      },

      // Applies a new transformation to the icon.
      addTransform: function(prop, values) {
        var connector = this.connector;
        var tfmStr = connector.getAttribute('transform');
        var inline = prop + '(' + values.join(',') + ')';
        if (tfmStr) {
          tfmStr += ' ' + inline;
        } else {
          tfmStr = inline;
        }

        connector.setAttribute('transform', tfmStr);
      },

      // Erases all the transformations.
      clearTransform: function() {
        this.connector.removeAttribute('transform');
      },

      // Flips horizontally the icon.
      flipX: function(refresh) {
        var x = this.getViewBox().width * -1;
        var y = 0;
        this.addTransform('scale', [-1, 1], refresh);
        this.addTransform('translate', [x, y], refresh);
      },

      // Flips vertically the icon.
      flipY: function(refresh) {
        var x = 0;
        var y = this.getViewBox().height * -1;
        this.addTransform('scale', [1, -1], refresh);
        this.addTransform('translate', [x, y], refresh);
      },

      // Rotates the icon.
      rotate: function(a) {
        var vb = this.getViewBox();
        this.addTransform(
          'rotate',
          [parseFloat(a), vb.width / 2, vb.height / 2]
        );
      },

      // Moves the icon.
      translate: function(pos) {
        var style = this.shadow.style;
        var tfmStr = style.transform || style.msTransform || style.webkitTransform || style.oTransform || '';

        if (tfmStr) {
          tfmStr += ' ';
        }

        tfmStr += 'translate(' + pos.join(',') + ')';

        style.msTransform = tfmStr;
        style.oTransform = tfmStr;
        style.webkitTransform = tfmStr;
        style.transform = tfmStr;
      },

      // Gets the reference size of the icon
      getRefSize: function() {
        var size = this.getSize();
        return Math.max(size.height, size.width);
      },

      // Gets the size of the icon
      getSize: function() {
        return this.shadow.getBoundingClientRect();
      },

      // Gets the viewBox of the svg shadow element
      getViewBox: function() {
        return this.shadow.viewBox.baseVal;
      },

      // Forces the viewbox of the icon
      setViewBox: function(x, y, width, height) {
        this.shadow.setAttribute(
            'viewBox',
            [x, y, width, height].join(' ')
        );
      },

    };

    // Entry points to icons.
    return {

      has: function(element) {
        if (element && element.nodeType) {
          var meta = new MetaData(element);
          var id = meta.get(key);
          return (id && warehouse[id]);
        }

        return false;
      },

      load: function(element) {
        if (!element || !element.nodeType) {
          throw new TypeError('Invalid element');
        }

        var meta = new MetaData(element);
        if (meta.has(key)) {
          var id = meta.get(key);
          if (warehouse[id]) {
            return warehouse[id];
          } else {
            meta.remove(key);
            return createIcon(element, meta);
          }
        } else {
          return createIcon(element, meta);
        }
      },

      remove: function(element) {
        var meta = new MetaData(element);
        if (meta.has(key)) {
          var id = meta.get(key);
          var icon = warehouse[id];

          meta.remove(key);
          icon.remove();
          warehouse[id] = null;
          return true;
        }

        return false;
      },
    };

  })();

  // Represents a complete collection of icons.
  var Theme = (function() {

    var warehouse = [];

    // Checks if the size of the icon allows the use of a theme
    function checkSize(theme, icon) {
      var range = theme.sizeRange;
      var size = icon.getRefSize();
      return (
          (range[0] === -1 || size >= range[0]) &&
          (range[1] === -1 || size <= range[1])
      );
    }

    // Algorithm to determine the best choice between two sprites.
    // If an icon can uses many themes, this function selects the more adapted
    // by comparing the sizes ranges, then the nearest container of the icon.
    function selectTheme(icon, recentTheme, oldTheme) {
      if (!oldTheme) { return recentTheme; }

      var r1 = recentTheme.sizeRange;
      var r2 = oldTheme.sizeRange;
      var ref = icon.getRefSize();
      var d1 = diff(ref, (r1[0] + r1[1]) / 2);
      var d2 = diff(ref, (r2[0] + r2[1]) / 2);

      if (d1 === d2) {
        // Same size range, uses containers position in the tree DOM
        return (oldTheme.container.contains(recentTheme.container)) ?
            recentTheme :
            oldTheme;
      } else if (d1 > d2) {
        // oldTheme is better
        return oldTheme;
      } else {
        // recentTheme is better
        return recentTheme;
      }
    }

    // Calculates the difference value between two numbers (helper).
    function diff(n1, n2) {
      return (n1 > n2) ? n1 - n2 : n2 - n1;
    }

    // The public implementation of the class.
    var Theme = function(sprite) {
      this.container = $body;
      this.sizeRange = new Array(2);
      this.sprite = sprite;

      this.id = (warehouse.push(this)) - 1;
      this.setSizeRange(-1, -1);
    };

    Theme.prototype = {

      // Allows to duplicate a theme.
      clone: function() {
        var theme = new Theme(this.sprite);
        theme.setSizeRange(this.sizeRange[0], this.sizeRange[1]);
        theme.setContainer(this.container);
        return theme;
      },

      // Applies a callback function on each icons controlled by the theme.
      forEachIcons: function(callback, thisArg) {
        $$('[data-icon][data-theme-id="' + this.id + '"]', this.container).forEach(function(element) {
          callback.call(thisArg, Icon.load(element));
        });
      },

      // Returns an array of icons which use the same pictogram
      getIconsByName: function(name) {
        var icons = [];
        $$('[data-icon="' + name + '"][data-theme-id="' + this.id + '"]', this.container).forEach(function(element) {
          icons.push(Icon.load(element));
        });

        return icons;
      },

      // Displays the icons in the document.
      render: function() {
        var icon;
        var pictogram;
        var _this;

        // Selects all the icons from the container element
        $$('[data-icon]', this.container).forEach(function(element) {
          icon = Icon.load(element);
          _this = this;

          // Checks if the icon is available with the theme
          if (checkSize(this, icon)) {
            if (icon.meta.has('theme-id')) {
              theme = selectTheme(this, warehouse[icon.meta.get('theme-id')]);
            }

            if (_this === this) {
              icon.meta.set('theme-id', this.id);
              pictogram = this.sprite.find(icon.meta.get('icon'));
              if (pictogram) {
                icon.draw(pictogram);
              }
            }
          }
        }, this);
      },

      // Changes the size range of the theme.
      setSizeRange: function(min, max) {
        this.sizeRange[0] = min | 0;
        this.sizeRange[1] = max | 0;
      },

      // Changes the container of the theme
      // A container is the root element of a theme, only the icons contained in
      // this element can use the theme.
      setContainer: function(element) {
        if (element && element.nodeType && isInPage(element)) {
          this.container = element;
          return true;
        }

        return false;
      },

    };

    return Theme;
  })();

  // Entry points of the library
  var uxon = self.uxon = {

    // Provides a direct access to the icons
    icons: Icon,

    // Allows to use a custom loader
    initLoader: svgLoader,

    // loads an external SVG file as sprite.
    load: function(loader, onFulfilled, onRejected) {
      if (!onRejected) { onRejected = callback; }

      if (typeof loader === 'string') {
        loader = svgLoader(loader);
      } else if (!loader || !loader.request) {
        onRejected(new TypeError('Invalid Request'));
      }

      loader.then(
                function(svg) {
                  uxon.make(svg, onFulfilled, onRejected);
                },

                function(error) {
                  onRejected(error);
                }
            );
      loader.send();
    },

    // Loads a sprite already presents in the page.
    // This method autorun the render of the icons if none onFulfilled callback
    // function exist. Else, the user must call the theme.render() action for
    // display the icons.
    make: function(svg, onFulfilled, onRejected) {
      var theme;
      var autorun = false;

      if (!onFulfilled) {
        onFulfilled = callback;
        autorun = true;
      }

      if (!onRejected) { onRejected = callback; }

      try {
        var sprite = new Sprite(svg);
        theme = new Theme(sprite);
        onFulfilled(theme);
        if (autorun) {
          theme.render();
        }
      } catch (e) {
        onRejected(e);
      }
    },

  };

})();
