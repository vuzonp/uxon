//! uxon.js
//! version: 0.1.0
//! author: Thomas Girard
//! license: MIT
(function() {

    "use strict";

    if (! self.SVGElement) { return; } // Too old browser.

    var $body = document.body;

    // XML namespaces:
    var nsSVG = "http://www.w3.org/2000/svg",
        nsXLINK = "http://www.w3.org/1999/xlink";

    // Generic empty callback
    var callback = function() { };

    // Helpers
    //--------------------------------------------------------------------------

    // http://lea.verou.me/2015/04/jquery-considered-harmful/
    function $(selectors, container) {
        return (typeof selectors === "string") ?
                (container || document).querySelector(selectors) :
                null;
    }
    function $$(selectors, container) {
        return [].slice.call((container || document).querySelectorAll(selectors));
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
    function isInPage(node) {
        return (node === $body) ? false : $body.contains(node);
    }

    // Helper for add a new css class
    function addClass(element, cname) {
        if ("classList" in element) {
            element.classList.add(cname);
        } else { // IE9
            element.className.baseVal += " " + cname;
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

    // Represent data for custom attributes added to elements
    var MetaData = (function() {

        var prefix = "data-";

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
            }
        };

        return Data;

    })();

    // The loader of the external SVG files
    var svgLoader = (function() {

        var errServer = "Unable to access resource",
            errSVG = "Invalid SVG file format",
            method = "GET",
            mime = "image/svg+xml";

        // Checks cross-domain requests from url
        function isCORS(url) {
            return (
                url.indexOf("http") >= 0 &&
                url.indexOf(location.hostname) < 0
            );
        }

        // Convert DOMString to SVG node for IE9-10
        function textToSVG(str) {
            var svg = null;
            if (window.DOMParser) {
                var parser = new DOMParser();
                svg = parser.parseFromString(str, mime);
                var found = svg.getElementsByTagName("parsererror");
                return (
                    (! found || ! found.length || ! found[0].childNodes.length) &&
                    svg.documentElement instanceof SVGElement
                ) ?
                svg.documentElement :
                null;
            }
            return svg;
        }

        var AbstractLoader = function(url) {
            this.cors = false;
            this.request = null;
            this.onRejected = callback;
            this.onFulfilled = callback;
            this.headers = [];
            this.url = encodeURI(url);
        };
        var _AbstractLoader = AbstractLoader.prototype = {

            addHeader: function(prop, value) {
                var header = new Array(2);
                header[0] = prop + "";
                header[1] = value + "";
                this.headers.push(header);
                return this;
            },

            // Defines the actions to handle after the loading.
            then: function(onFulfilled, onRejected) {
                if (typeof onFulfilled === "function") {
                    this.onFulfilled = onFulfilled;
                }
                if (typeof onRejected === "function") {
                    this.onRejected = onRejected;
                }
            },

            send: function() {}

        };

        // For Gecko, Webkit, >=IE10 and IE9 for non-CORS requests.
        var XhrLoader = function(url, cors) {
            AbstractLoader.call(this, url);
            this.cors = !!cors;
            var req = this.request = new XMLHttpRequest();
            req.open(method, this.url, true);
        };

        var _XhrLoader = XhrLoader.prototype = Object.create(_AbstractLoader);

        _XhrLoader.constructor = XhrLoader;

        _XhrLoader.send = function() {
            var onRejectedCallback = this.onRejected,
                onFulfilledCallback = this.onFulfilled,
                xhr = this.request;

            // Prepares the request
            this.addHeader("Content-Type", mime);
            if ("overrideMimeType" in xhr) {
                 xhr.overrideMimeType(mime);
            }

            if (this.cors) {
                // fixme ?
                //xhr.withCredentials = true;
            } else {
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

                        } catch(e) {
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

        // For IE 9 CORS requests
        var XdrLoader = function(url) {
            AbstractLoader.call(this, url);
            var req = this.request = new XDomainRequest();
            req.open(method, this.url);
        };

        var _XdrLoader = XdrLoader.prototype = Object.create(_AbstractLoader);

        _XdrLoader.constructor = XdrLoader;

        _XdrLoader.send = function() {
            var onRejectedCallback = this.onRejected,
                onFulfilledCallback = this.onFulfilled,
                xdr = this.request;

            xdr.onload = function() {
                try {
                    var svg = textToSVG(xdr.responseText);
                    if (svg) {
                        onFulfilledCallback(svg);
                    } else {
                        throw new TypeError(errSVG);
                    }
                } catch(e) {
                    onRejectedCallback(e);
                }
            };
            xdr.onerror = function() {
                onRejectedCallback(errServer);
            };
            xdr.ontimeout = function() {
                onRejectedCallback(new Error(errServer));
            };
            // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
            setTimeout(function () { xdr.send(); }, 0);
        };

        var loader = function(url) {
            var cors = isCORS(url);
            if (! cors || ("withCredentials" in XMLHttpRequest.prototype)) {
                return new XhrLoader(url, cors);
            } else if (typeof XDomainRequest != "undefined") { // <=IE10
                return new XdrLoader(url);
            } else {
                throw new Error("[Uxôn] Too old browser");
            }
        };

        return loader;

    })();

    // Toolkit Widgets
    //--------------------------------------------------------------------------

    // Represents a SVG sprite / Map of pictograms.
    var Sprite = (function() {

        var counter = 0;

        // Adds a prefix to the IDs DOM pictograms
        function prefix(element, str) {
            var pictograms = {};
            element.id = str;
            $$("symbol[id], g[id]", element).forEach(function(child) {
                child.id = [str, child.id].join("-");
                pictograms[child.id] = new Pictogram(child);
            });
            $$("use", element).forEach(function(use) {
                use.setAttributeNS(
                    nsXLINK,
                    "href",
                    "#" + str + "-" + use.getAttributeNS(nsXLINK, "href").slice(1)
                );
            });
            return pictograms;
        }

        var Sprite = function(svg) {
            if (! (svg instanceof SVGElement)) {
                throw new TypeError("Invalid sprite element");
            }

            // Do not display the sprite.
            svg.setAttribute("aria-hidden", true);
            svg.removeAttribute("height");
            svg.removeAttribute("width");
            addClass(svg, "uxon");
            addClass(svg, "uxon-sprite");

            // import the element into the document
            if (! isInPage(svg)) {
                // https://code.google.com/p/chromium/issues/detail?id=349175
                $body.insertBefore(svg, $body.firstChild);
            }

            this.element = svg;
            this.pictograms = prefix(svg, "uxon" + counter++);
        };
        Sprite.prototype = {

            // Creates a copy of the sprite.
            clone: function(prefix) {
                var svg = this.element.cloneNode(true);
                var sprite = new Sprite(svg);
                sprite.prefix(prefix);
                return sprite;
            },

            // Checks if the sprite contains a pictogram
            has: function(id) {
                return (
                    this.pictograms[id] &&
                    this.pictograms[id] instanceof Pictogram
                );
            },

            // Search and find a pictogram with the name of the pictogram.
            find: function(name) {
                var element = $("g[id$=" + name +"], symbol[id$=" + name +"]", this.element);
                return (element) ? this.get(element.id) : null;
            },

            // Get a pictogram
            get: function(id) {
                return this.pictograms[id] || null;
            },

            // Remove a pictogram
            remove: function(id) {
                if (this.has(id)) {
                    this.pictograms[id].parentNode.removeChild(this.pictograms[id]);
                    this.pictograms[id] = null;
                    return true;
                }
                return false;
            },

            // Update the cache of pictograms
            update: function() {
                this.pictograms = {};
                $$("symbol[id], g[id]", this.element).forEach(function(child) {
                    this.pictograms[child.id] = new Pictogram(child);
                }, this);
            }

        };

        return Sprite;

    })();

    // Visual reference of icons
    var Pictogram = function(svg) {
        if (svg instanceof SVGElement && svg.id) {
            this.element = svg;
        } else {
            throw new Error("Invalid pictogram element");
        }
    };
    Pictogram.prototype = {

        // Gets the IRI of the pictogram
        getIRI: function() {
            return "#" + this.element.id;
        },

        // Gets the viewBox of the pictogram
        getViewBox: function() {
            var svg = this.element;
            return (!! svg.viewBox.baseVal &&
                    svg.viewBox.baseVal.width > 0) ? // For Webkit
                svg.viewBox.baseVal :
                svg.ownerSVGElement.viewBox.baseVal;
        }

    };

    // Icon component
    var Icon = (function() {

        var warehouse = [],
            key = "uxon-id";

        // Connector's templates
        var tplConnector = (function() {
            var svg = document.createElementNS(nsSVG, "use");
            svg.setAttributeNS(
                nsXLINK,
                "href",
                "#empty"
            );
            return svg;
        })();

        // SVG icons template
        var tplShadow = (function() {
            var svg = document.createElementNS(nsSVG, "svg");
            svg.className.baseVal = "uxon uxon-icon";
            return svg;
        })();

        function createIcon(element, meta) {
            var id = warehouse.push(new Icon(element, meta));
            meta.set(key, --id);
            return warehouse[id];
        }

        // Icon class
        var Icon = function(element, meta) {
            if (! element.parentNode) {
                throw new Error("Icon's element must have a parent node");
            }
            this.connector = tplConnector.cloneNode();
            this.element = element;
            this.meta = meta;
            var shadow = this.shadow = tplShadow.cloneNode();

            // Set the svg in the document
            shadow.appendChild(this.connector);
            this.element.parentNode.insertBefore(
                shadow,
                element.nextSibling
            );
        };

        Icon.prototype = {

            // Generate the icon
            draw: function(pictogram) {
                if (! (pictogram instanceof Pictogram)) {
                    throw new TypeError("Invalid pictogram");
                }
                this.connector.setAttributeNS(
                    nsXLINK,
                    "xlink:href",
                    "#" + pictogram.element.id
                );
                var box = pictogram.getViewBox();
                this.setViewBox(
                    box.x,
                    box.y,
                    box.width,
                    box.height
                );
                this.parse();
            },

            // Get the reference size of the icon
            getRefSize: function() {
                var size = this.getSize();
                return Math.max(size.height, size.width);
            },

            // Get the size of the icon
            getSize: function() {
                return this.shadow.getBoundingClientRect();
            },

            // Get the viewBox of the svg shadow element
            getViewBox: function() {
                return this.shadow.viewBox.baseVal;
            },

            // Force the viewbox of the icon
            setViewBox: function(x, y, width, height) {
                this.shadow.setAttribute(
                    "viewBox",
                    [x, y, width, height].join(" ")
                );
            }

        };

        return {

            has: function(element) {
                if (element && element.nodeType) {
                    var meta = new MetaData(element),
                        id = meta.get(key);
                    return (id && warehouse[id]);
                }
                return false;
            },

            load: function(element) {
                //debugger;
                if (! element || ! element.nodeType) {
                    throw new TypeError("Invalid element");
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
                    var id = meta.get(key),
                        icon = warehouse[id];

                    meta.remove(key);
                    icon.remove();
                    warehouse[id] = null;
                    return true;
                }
                return false;
            }
        };

    })();

    var Theme = (function() {

        var warehouse = [];

        function checkSize(theme, icon) {
            var range = theme.sizeRange,
                size = icon.getRefSize();
            return (
                (range[0] === -1 || size >= range[0]) &&
                (range[1] === -1 || size <= range[1])
            );
        }

        function selectTheme(icon, recentTheme, oldTheme) {
            if (! oldTheme) { return recentTheme; }

            var r1 = recentTheme.sizeRange,
                r2 = oldTheme.sizeRange,

                ref = icon.getRefSize(),

                d1 = diff(ref, (r1[0] + r1[1]) / 2),
                d2 = diff(ref, (r2[0] + r2[1]) / 2);

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

        function diff(n1, n2) {
            return (n1 > n2) ? n1 - n2 : n2 - n1;
        }

        var Theme = function(sprite) {
            this.container = $body;
            this.sizeRange = new Array(2);
            this.sprite = sprite;

            this.id = (warehouse.push(this)) - 1;
            this.setSizeRange(-1, -1);
            this.render();
        };

        Theme.prototype = {

            clone: function() {
                var theme = new Theme(this.sprite);
                theme.setSizeRange(this.sizeRange[0], this.sizeRange[1]);
                theme.setContainer(this.container);
                return theme;
            },

            forEachIcons: function(callback, thisArg) {
                $$("[data-icon][data-theme-id='"+ this.id +"']", this.container).forEach(function(element) {
                    callback.call(thisArg, Icon.load(element));
                });
            },

            render: function() {
                var icon, pictogram, theme;

                // Selects all the icons from the container element
                $$("[data-icon]", this.container).forEach(function(element) {
                    icon = Icon.load(element);
                    theme = this;
                    // Verifies if the icon is available with the theme
                    if (checkSize(this, icon)) {
                        if (icon.meta.has("theme-id")) {
                            theme = selectTheme(this, warehouse[icon.meta.get("theme-id")]);
                        }
                        if (theme === this) {
                            icon.meta.set("theme-id", this.id);
                            pictogram = this.sprite.find(icon.meta.get("icon"));
                            if (pictogram) {
                                icon.draw(pictogram);
                            }
                        }
                    }
                }, this);
            },

            setSizeRange: function(min, max) {
                this.sizeRange[0] = min|0;
                this.sizeRange[1] = max|0;
            },

            setContainer: function(element) {
                if (element && element.nodeType && isInPage(element)) {
                    this.container = element;
                    return true;
                }
                return false;
            }

        };

        return Theme;
    })();

    // Public
    var uxon = self.uxon = {

        initLoader: svgLoader,

        // loads an external sprite
        load: function(request, onFulfilled, onRejected) {
            if (! onFulfilled) { onFulfilled = callback; }
            if (! onRejected) { onRejected = callback; }
            var loader;

            if (typeof request === "string") {
                loader = svgLoader(request);
            } else if (request instanceof SVGLoaderInterface) {
                loader = request;
            } else {
                onRejected(new TypeError("Invalid Request"));
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

        // Uses local sprites
        make: function(svg, onFulfilled, onRejected) {
            var theme;
            if (! onFulfilled) { onFulfilled = callback; }
            if (! onRejected) { onRejected = callback; }
            try {
                var sprite = new Sprite(svg);
                theme = new Theme(sprite);
                onFulfilled(theme);
            } catch(e) {
                onRejected(e);
            }
        }

    };

})();
