System.registerDynamic("github:jspm/nodelibs-process@0.2.0-alpha.json",[],!1,function(){return{main:"./process.js"}}),System.registerDynamic("github:jspm/nodelibs-process@0.2.0-alpha/process.js",["@system-env"],!0,function(a,b,c){function d(){l=!1,h.length?k=h.concat(k):m=-1,k.length&&e()}function e(){if(!l){var a=setTimeout(d);l=!0;for(var b=k.length;b;){for(h=k,k=[];++m<b;)h&&h[m].run();m=-1,b=k.length}h=null,l=!1,clearTimeout(a)}}function f(a,b){this.fun=a,this.array=b}function g(){}var h,i=a("@system-env").production,j=c.exports={},k=[],l=!1,m=-1;return j.nextTick=function(a){var b=new Array(arguments.length-1);if(arguments.length>1)for(var c=1;c<arguments.length;c++)b[c-1]=arguments[c];k.push(new f(a,b)),1!==k.length||l||setTimeout(e,0)},f.prototype.run=function(){this.fun.apply(null,this.array)},j.title="browser",j.browser=!0,j.env={NODE_ENV:i?"production":"development"},j.argv=[],j.version="",j.versions={},j.on=g,j.addListener=g,j.once=g,j.off=g,j.removeListener=g,j.removeAllListeners=g,j.emit=g,j.binding=function(a){throw new Error("process.binding is not supported")},j.cwd=function(){return"/"},j.chdir=function(a){throw new Error("process.chdir is not supported")},j.umask=function(){return 0},c.exports}),System.registerDynamic("npm:weakmap@0.0.6.json",[],!1,function(){return{main:"weakmap.js",format:"cjs",meta:{"*":{globals:{process:"process"}},"*.json":{format:"json"}}}}),System.registerDynamic("npm:weakmap@0.0.6/weakmap.js",["process"],!0,function(a,b,c){a("process");return void function(a,d,e){function f(a,b,c){return"function"==typeof b&&(c=b,b=g(c).replace(/_$/,"")),j(a,b,{configurable:!0,writable:!0,value:c})}function g(a){return"function"!=typeof a?"":"name"in a?a.name:k.call(a).match(n)[1]}function h(a){function b(b,d){return d||2===arguments.length?c.set(b,d):(d=c.get(b),d===e&&(d=a(b),c.set(b,d))),d}var c=new p;return a||(a=q),b}var i=Object.getOwnPropertyNames,j=Object.defineProperty,k=Function.prototype.toString,l=Object.create,m=Object.prototype.hasOwnProperty,n=/^\n?function\s?(\w*)?_?\(/,o=function(){function a(){var a=g(),d={};this.unlock=function(e){var f=k(e);if(m.call(f,a))return f[a](d);var g=l(null,b);return j(f,a,{value:new Function("s","l",c)(d,g)}),g}}var b={value:{writable:!0,value:e}},c="return function(k){if(k===s)return l}",d=l(null),g=function(){var a=Math.random().toString(36).slice(2);return a in d?g():d[a]=a},h=g(),k=function(a){if(m.call(a,h))return a[h];if(!Object.isExtensible(a))throw new TypeError("Object must be extensible");var b=l(null);return j(a,h,{value:b}),b};return f(Object,function(a){var b=i(a);return m.call(a,h)&&b.splice(b.indexOf(h),1),b}),f(a.prototype,function(a){return this.unlock(a).value}),f(a.prototype,function(a,b){this.unlock(a).value=b}),a}(),p=function(b){function c(b){return this===a||null==this||this===c.prototype?new c(b):(n(this,new o),void q(this,b))}function h(a){m(a);var b=p(this).get(a);return b===d?e:b}function i(a,b){m(a),p(this).set(a,b===e?d:b)}function j(a){return m(a),p(this).get(a)!==e}function k(a){m(a);var b=p(this),c=b.get(a)!==e;return b.set(a,e),c}function l(){return p(this),"[object WeakMap]"}var m=function(a){if(null==a||"object"!=typeof a&&"function"!=typeof a)throw new TypeError("Invalid WeakMap key")},n=function(a,c){var d=b.unlock(a);if(d.value)throw new TypeError("Object is already a WeakMap");d.value=c},p=function(a){var c=b.unlock(a).value;if(!c)throw new TypeError("WeakMap is not generic");return c},q=function(a,b){null!==b&&"object"==typeof b&&"function"==typeof b.forEach&&b.forEach(function(c,d){c instanceof Array&&2===c.length&&i.call(a,b[d][0],b[d][1])})};try{var r=("return "+k).replace("e_","\\u0065"),s=new Function("unwrap","validate",r)(p,m)}catch(t){var s=k}var r=(""+Object).split("Object"),u=function(){return r[0]+g(this)+r[1]};f(u,u);var v={__proto__:[]}instanceof Array?function(a){a.__proto__=u}:function(a){f(a,u)};return v(c),[l,h,i,j,s].forEach(function(a){f(c.prototype,a),v(a)}),c}(new o),q=Object.create?function(){return Object.create(null)}:function(){return{}};"undefined"!=typeof c?c.exports=p:"undefined"!=typeof b?b.WeakMap=p:"WeakMap"in a||(a.WeakMap=p),p.createStorage=h,a.WeakMap&&(a.WeakMap.createStorage=h)}((0,eval)("this")),c.exports}),System.register("uxon/loader.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/possibleConstructorReturn.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/inherits.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","./misc/utils.js","./errors.js"],function(a){"use strict";function b(a){var b=null;if(!window.DOMParser)throw new k("DOMParser");var c=new DOMParser;b=c.parseFromString(a,"image/svg+xml");var d=i("parsererror",b);if(d&&d.length>0)throw new j(d.textContent);return b}function c(a){var b=/^https?:\/\/([^\/]+)\/|:/.exec(a);return b&&b[1]!==location.host}function d(a){var b=c(a);if(!b||"withCredentials"in XMLHttpRequest.prototype)return new y(a,b);if("undefined"!=typeof XDomainRequest)return new z(a);throw new k("XDomainRequest")}var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z;return{setters:[function(a){e=a["default"]},function(a){f=a["default"]},function(a){g=a["default"]},function(a){h=a["default"]},function(a){i=a.$},function(a){j=a.InvalidSVGDocument,k=a.NotImplemented,l=a.RequestError}],execute:function(){m=function(a){throw a},n=function(){},o="Callback argument must be a function.",p="GET",q="image/svg+xml",r=new WeakMap,s=new WeakMap,t=new WeakMap,u=new WeakMap,v=new WeakMap,w=new WeakMap,x=function(){function a(b){g(this,a),s.set(this,[]),t.set(this,m),u.set(this,n),w.set(this,encodeURI(b)),Object.defineProperties(this,{request:{get:function(){return v.get(this)}},url:{get:function(){return w.get(this)}}})}return h(a,[{key:"addHeader",value:function(a,b){s.get(this).push([a+"",b+""])}},{key:"send",value:function(){throw new k("Loader","send")}},{key:"onerror",set:function(a){if("function"!=typeof a)throw new InvalidArgument(o);t.set(this,a)},get:function(){return t.get(this)}},{key:"onsuccess",set:function(a){if("function"!=typeof a)throw new InvalidArgument(o);u.set(this,a)},get:function(){return u.get(this)}}]),a}(),y=function(a){function c(a,b){g(this,c);var d=e(this,Object.getPrototypeOf(c).call(this,a)),f=new XMLHttpRequest;return f.open(p,d.url,!0),r.set(d,!!b),v.set(d,f),d}return f(c,a),h(c,[{key:"send",value:function(){function a(){d(new l(e.statusText))}var c=u.get(this),d=t.get(this),e=this.request;this.addHeader("Content-Type",q),"overrideMimeType"in e&&e.overrideMimeType(q),r.get(this)||this.addHeader("X-Requested-With","XMLHttpRequest"),s.get(this).forEach(function(a){e.setRequestHeader(a[0],a[1])}),e.onload=function(){if(200===this.status)try{var f=null;if(f=this.responseXML&&this.responseXML.documentElement&&"overrideMimeType"in e?this.responseXML.documentElement:b(this.responseText),!f)throw new j;c(f)}catch(g){d(g)}else a()},e.onerror=a,e.ontimeout=a,e.send(null)}}]),c}(x),z=function(a){function c(a){g(this,c);var b=e(this,Object.getPrototypeOf(c).call(this,a)),d=new XDomainRequest;return d.open(b.method,b.url),r.set(b,!!cors),v.set(b,d),b}return f(c,a),h(c,[{key:"send",value:function(){function a(){d(new l(e.statusText))}var c=this.onSuccess,d=this.onError,e=this.request;e.onload=function(){try{var a=b(e.responseText);if(!a)throw new j;c(a)}catch(f){d(f)}},e.onerror=a,e.ontimeout=a}}]),c}(x),a("default",d)}}}),System.register("npm:systemjs-plugin-babel@0.0.2/babel-helpers/slicedToArray.js",[],function(a){"use strict";return{setters:[],execute:function(){a("default",function(){function a(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!b||c.length!==b);d=!0);}catch(i){e=!0,f=i}finally{try{!d&&h["return"]&&h["return"]()}finally{if(e)throw f}}return c}return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}())}}}),System.register("uxon/misc/attributes.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/possibleConstructorReturn.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/inherits.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","../errors.js"],function(a){"use strict";function b(a){var b=typeof a,c="";return"string"===b||"number"===b?c+=a:"boolean"===b?c+=0|a:a&&(c=JSON.stringify(a)),c}var c,d,e,f,g,h,i,j;return{setters:[function(a){c=a["default"]},function(a){d=a["default"]},function(a){e=a["default"]},function(a){f=a["default"]},function(a){g=a.InvalidElement}],execute:function(){h=function(){function a(b,c){if(e(this,a),!b||1!==b.nodeType)throw new g("Element");this.element=b,this.prefix=c+"-"}return f(a,[{key:"has",value:function(a){return this.element.hasAttribute(this.prefix+a)}},{key:"get",value:function(a){return this.element.getAttribute(this.prefix+a)}},{key:"set",value:function(a,c){return this.element.setAttribute(this.prefix+a,b(c))}},{key:"remove",value:function(a){return this.element.removeAttribute(this.prefix+a)}}]),a}(),i=function(a){function b(a){return e(this,b),c(this,Object.getPrototypeOf(b).call(this,a,"data"))}return d(b,a),b}(h),a("CustomAttr",i),j=function(a){function b(a){return e(this,b),c(this,Object.getPrototypeOf(b).call(this,a,"aria"))}return d(b,a),b}(h),a("AriaAttr",j)}}}),System.register("uxon/components/snippets.js",["../misc/utils.js"],function(a){"use strict";var b,c,d;return{setters:[function(a){b=a.createSVGElement}],execute:function(){c=function(){var a=b("svg");return a.setAttribute("aria-hidden","true"),a}(),d=function(){var a=b("use");return a}(),a("default",{icon:c,connector:d})}}}),System.register("uxon/components/Transform.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","../errors.js"],function(a){"use strict";var b,c,d,e,f,g,h;return{setters:[function(a){b=a["default"]},function(a){c=a["default"]},function(a){d=a.InvalidElement}],execute:function(){e=new WeakMap,f=new WeakMap,g=new WeakMap,h=function(){function a(c){if(b(this,a),!c.viewportElement)throw new d("A not `viewport` SVGElement");e.set(this,c.ownerSVGElement),f.set(this,c.transform.baseVal),g.set(this,c.viewportElement.viewBox.baseVal)}return c(a,[{key:"clear",value:function(){f.get(this).clear()}},{key:"rotate",value:function(a,b,c){b=b||g.get(this).width/2,c=c||g.get(this).height/2;var d=e.get(this).createSVGTransform();d.setRotate(a,b,c),f.get(this).appendItem(d)}},{key:"flipX",value:function(){var a=-1*g.get(this).width,b=0,c=e.get(this).createSVGTransform(),d=e.get(this).createSVGTransform(),h=f.get(this);c.setScale(-1,1),h.appendItem(c),d.setTranslate(a,b),h.appendItem(d)}},{key:"flipY",value:function(){var a=0,b=-1*g.get(this).height,c=e.get(this).createSVGTransform(),d=e.get(this).createSVGTransform(),h=f.get(this);c.setScale(1,-1),h.appendItem(c),d.setTranslate(a,b),h.appendItem(d)}},{key:"translate",value:function(a,b){var c=e.get(this).createSVGTransform();c.setTranslate(a,b),f.get(this).appendItem(c)}},{key:"remove",value:function(){this.clear(),e["delete"](this),f["delete"](this),g["delete"](this)}}]),a}(),a("default",h)}}}),System.register("uxon/components/IconTransform.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/possibleConstructorReturn.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/inherits.js","./Transform.js"],function(a){"use strict";var b,c,d,e,f,g;return{setters:[function(a){b=a["default"]},function(a){c=a["default"]},function(a){d=a["default"]},function(a){e=a["default"]},function(a){f=a["default"]}],execute:function(){g=function(a){function f(){return b(this,f),d(this,Object.getPrototypeOf(f).apply(this,arguments))}return e(f,a),c(f,[{key:"translate",value:function(a,b){var c=this.svgElement.style,d=c.transform||c.msTransform||c.webkitTransform||c.oTransform||"";d&&(d+=" "),d+="translate("+[a,b].join(",")+")",c.msTransform=d,c.oTransform=d,c.webkitTransform=d,c.transform=d}}]),f}(f),a("default",g)}}}),System.register("uxon/components/Icon.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/slicedToArray.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","../errors.js","../misc/attributes.js","../misc/namespaces.js","./snippets.js","./IconTransform.js","./Pictogram.js"],function(a){"use strict";var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u;return{setters:[function(a){b=a["default"]},function(a){c=a["default"]},function(a){d=a["default"]},function(a){e=a.InvalidArgument,f=a.InvalidElement,g=a.RuntimeException},function(a){h=a.AriaAttr,i=a.CustomAttr},function(a){j=a["default"]},function(a){k=a["default"]},function(a){l=a["default"]},function(a){m=a["default"]}],execute:function(){n=new WeakMap,o=new WeakMap,p=new WeakMap,q=new WeakMap,r=new WeakMap,s=new WeakMap,t=new WeakMap,u=function(){function a(b){if(c(this,a),!(b instanceof HTMLElement))throw new f("HTMLElement",b);var d=a.snippets.connector.cloneNode(),e=a.snippets.icon.cloneNode();b.setAttribute("role","img"),e.appendChild(d),n.set(this,new h(b)),o.set(this,d),p.set(this,b),q.set(this,new i(b)),r.set(this,m.replacement),s.set(this,e),Object.defineProperties(this,{aria:{get:function(){return n.get(this)}},connector:{get:function(){return o.get(this)}},element:{get:function(){return p.get(this)}},meta:{get:function(){return q.get(this)}},pictogram:{get:function(){return r.get(this)}},svgElement:{get:function(){return s.get(this)}}})}return d(a,[{key:"applyTransforms",value:function(){if(this.meta.has("rotate"))this.transform().rotate(this.meta.get("rotate"));else if(this.meta.has("flip-x"))this.transform().flipX();else if(this.meta.has("flip-y"))this.transform().flipY();else if(this.meta.has("translate")){var a=this.meta.get("translate").split(",",2),c=b(a,2),d=c[0],e=c[1];this.transform().translate(d,e)}}},{key:"draw",value:function(a){if(!(a instanceof m))throw new e("Invalid Pictogram");r.set(this,a),this.element.appendChild(this.svgElement);var b=a.getViewBox(),c=[b.x,b.y,b.width,b.height].join(" ");this.svgElement.setAttribute("viewBox",c),a.titleID&&!this.aria.has("label")&&this.aria.set("labelledby",a.titleID),a.descID&&!this.aria.has("description")&&this.aria.set("descriptedby",a.descID),this.connector.setAttributeNS(j.xlink,"xlink:href",a.getIRI()),this.applyTransforms()}},{key:"remove",value:function(){for(var a=this.element;a.firstChild;)a.removeChild(a.firstChild);this.aria.remove("labelledby"),this.aria.remove("descriptedby"),n["delete"](this),o["delete"](this),p["delete"](this),q["delete"](this),r["delete"](this),s["delete"](this),t["delete"](this)}},{key:"getSize",value:function(){return this.svgElement.getBoundingClientRect()}},{key:"getRefSize",value:function(){var a=this.getSize();return Math.max(a.height,a.width)}},{key:"transform",value:function(){var a=t.get(this);if(!a){if(!this.svgElement)throw new g("Unable to transform a non-drawn icon.");a=new l(this.connector),t.set(this,a)}return a}}]),a}(),u.snippets=k,a("default",u)}}}),System.register("uxon/components/IconCollection.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/possibleConstructorReturn.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/inherits.js","./Collection.js","./Icon.js"],function(a){"use strict";var b,c,d,e,f,g,h,i;return{setters:[function(a){b=a["default"]},function(a){c=a["default"]},function(a){d=a["default"]},function(a){e=a["default"]},function(a){f=a["default"]},function(a){g=a["default"]}],execute:function(){h=null,i=function(a){function f(){var a;b(this,f);var c=d(this,Object.getPrototypeOf(f).call(this));return h||(h=c),a=h,d(c,a)}return e(f,a),c(f,[{key:"load",value:function(a){return this.has(a)||this.set(a,new g(a)),this.get(a)}}]),f}(f),a("default",i)}}}),System.register("uxon/components/Collection.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js"],function(a){"use strict";function b(a,b,c){"remove"in a&&a.remove(),c["delete"](b)}var c,d,e,f;return{setters:[function(a){c=a["default"]},function(a){d=a["default"]}],execute:function(){e=new WeakMap,f=function(){function a(){c(this,a),e.set(this,new WeakMap)}return d(a,[{key:"clear",value:function(){e.get(this).forEach(b)}},{key:"delete",value:function(a){if(this.has(a)){var b=this.get(a);"remove"in b&&b.remove()}return e.get(this)["delete"](a)}},{key:"get",value:function(a){return e.get(this).get(a)}},{key:"has",value:function(a){return e.get(this).has(a)}},{key:"set",value:function(a,b){return e.get(this).set(a,b),this}}]),a}(),a("default",f)}}}),System.register("npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js",[],function(a){"use strict";return{setters:[],execute:function(){a("default",function(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")})}}}),System.register("npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js",[],function(a){"use strict";return{setters:[],execute:function(){a("default",function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}())}}}),System.register("npm:systemjs-plugin-babel@0.0.2/babel-helpers/possibleConstructorReturn.js",[],function(a){"use strict";return{setters:[],execute:function(){a("default",function(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!b||"object"!=typeof b&&"function"!=typeof b?a:b})}}}),System.registerDynamic("npm:systemjs-plugin-babel@0.0.2.json",[],!1,function(){return{main:"plugin-babel.js",map:{"systemjs-babel-build":{browser:"./systemjs-babel-browser.js"}},meta:{"./plugin-babel.js":{format:"cjs"}}}}),System.register("npm:systemjs-plugin-babel@0.0.2/babel-helpers/inherits.js",[],function(a){"use strict";return{setters:[],execute:function(){a("default",function(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)})}}}),System.register("uxon/errors.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/possibleConstructorReturn.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/inherits.js"],function(a){"use strict";var b,c,d,e,f,g,h,i,j,k,l,m;return{setters:[function(a){b=a["default"]},function(a){c=a["default"]},function(a){d=a["default"]},function(a){e=a["default"]}],execute:function(){f=function(a){function f(a){b(this,f);var c=d(this,Object.getPrototypeOf(f).call(this,a));return c.name=c.constructor.name,c.message=a+"",c}return e(f,a),c(f,[{key:"toString",value:function(){return"[error][Uxôn → "+this.name+"] "+this.message}}]),f}(Error),g=function(a){function c(a){return b(this,c),d(this,Object.getPrototypeOf(c).call(this,a))}return e(c,a),c}(f),h=function(a){function c(a){return b(this,c),d(this,Object.getPrototypeOf(c).call(this,a))}return e(c,a),c}(g),a("InvalidArgument",h),i=function(a){function c(a,e){b(this,c);var f=e&&e.name?e.name:typeof e;return d(this,Object.getPrototypeOf(c).call(this,"Invalid DOM Element: `"+a+"` expected but `"+f+"` received."))}return e(c,a),c}(h),a("InvalidElement",i),j=function(a){function c(a){return b(this,c),d(this,Object.getPrototypeOf(c).call(this,a))}return e(c,a),c}(g),a("InvalidSVGDocument",j),k=function(a){function c(a,e){b(this,c);var f=e?a+":"+e+"()":a;return d(this,Object.getPrototypeOf(c).call(this,"Not Callable Function `"+f+"`"))}return e(c,a),c}(f),a("NotImplemented",k),l=function(a){function c(a){return b(this,c),d(this,Object.getPrototypeOf(c).call(this,"The request could not be completed - status code received: "+a||"???"))}return e(c,a),c}(f),a("RequestError",l),m=function(a){function c(a){return b(this,c),d(this,Object.getPrototypeOf(c).call(this,a))}return e(c,a),c}(f),a("RuntimeException",m)}}}),System.register("uxon/misc/namespaces.js",[],function(a){"use strict";var b,c;return{setters:[],execute:function(){b="http://www.w3.org/",c={svg:b+"2000/svg",xlink:b+"1999/xlink"},a("default",c)}}}),System.register("uxon/misc/utils.js",["../misc/namespaces.js"],function(a){"use strict";function b(a,b){return"string"==typeof a?(b||document).querySelector(a):null}function c(a,b){return[].slice.call((b||document).querySelectorAll(a))}function d(a){return a===i?!1:i.contains(a)}function e(a,b){"classList"in a?a.classList.add(b):a.className.baseVal+=" "+b}function f(a){return document.createElementNS(h.svg,a)}function g(a){return a.parentNode.removeChild(a)}var h,i,j;return a("$",b),a("$$",c),a("isInPage",d),a("addClass",e),a("createSVGElement",f),a("removeElement",g),{setters:[function(a){h=a["default"]}],execute:function(){i=document.body,a("$body",i),j=function(){var a=0,b=function(b){return b||(b="u_"),++a,b+a.toString(36)};return b}(),a("generateID",j)}}}),System.register("uxon/components/Pictogram.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","../errors.js","../misc/utils.js"],function(a){"use strict";var b,c,d,e,f,g,h,i,j,k,l,m;return{setters:[function(a){b=a["default"]},function(a){c=a["default"]},function(a){d=a.InvalidElement},function(a){e=a.$,f=a.generateID,g=a.removeElement}],execute:function(){h=function(){function a(a){if(a.viewBox.baseVal){var b=a.viewBox.baseVal;return c.indexOf(a.tagName.toLowerCase())&&(0!==b.height||0!==b.width||0!==b.x||0!==b.y)}return!1}var b={x:0,y:0,width:0,height:0},c=["image","marker","pattern","svg","symbol","view"],d=function(c){for(var d=c;d;){if(a(d))return d.viewBox.baseVal;d=d.viewportElement}return b};return d}(),i=new WeakMap,j=new WeakMap,k=new WeakMap,l=new WeakMap,m=function(){function a(c){if(b(this,a),!(c instanceof SVGElement))throw new d("SVGElement",c);i.set(this,c),this.rename(c.id);var g=e(this.getIRI()+" > title:first-of-type",c.parentNode),h=e(this.getIRI()+" > desc:first-of-type",c.parentNode);g&&(g.id||(g.id=f(c.id+"-t")),k.set(this,g.id)),h&&(h.id||(h.id=f(c.id+"-d")),l.set(this,h.id)),Object.defineProperties(this,{descID:{get:function(){return l.get(this)}},svgElement:{get:function(){return i.get(this)}},titleID:{get:function(){return k.get(this)}}})}return c(a,[{key:"getIRI",value:function(){return"#"+i.get(this).id}},{key:"getViewBox",value:function(){return j.has(this)||j.set(this,h(i.get(this))),j.get(this)}},{key:"rename",value:function(a){i.get(this).id=f("pict")+"-"+a}},{key:"remove",value:function(){g(i.get(this)),i["delete"](this),j["delete"](this),k["delete"](this),l["delete"](this)}}]),a}(),a("default",m)}}}),System.register("uxon/components/Sprite.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","../misc/utils.js","../errors.js","./Collection.js","./Pictogram.js"],function(a){"use strict";var b,c,d,e,f,g,h,i,j,k,l,m,n,o;return{setters:[function(a){b=a["default"]},function(a){c=a["default"]},function(a){d=a.$,e=a.$body,f=a.addClass,g=a.isInPage,h=a.generateID,i=a.removeElement},function(a){j=a.InvalidElement},function(a){k=a["default"]},function(a){l=a["default"]}],execute:function(){m=new WeakMap,n=new WeakMap,o=function(){function a(c){if(b(this,a),!(c instanceof SVGElement)||c.ownerSVGElement)throw new j("SVGElement",c);c.id=h("sprite")+c.id,c.setAttribute("aria-hidden",!0),c.removeAttribute("height"),c.removeAttribute("width"),f(c,"uxon"),f(c,"uxon-sprite"),g(c)||e.insertBefore(c,e.firstChild),m.set(this,new k),n.set(this,c),Object.defineProperty(this,"svgElement",{get:function(){return n.get(this)}})}return c(a,[{key:"clone",value:function(){return new a(n.get(this).cloneNode(!0))}},{key:"findPictogram",value:function(a){return this.getPictogram(d("g[id$="+a+"],symbol[id$="+a+"]",n.get(this)))}},{key:"getPictogram",value:function(a){return a&&n.get(this).contains(a)?(m.get(this).has(a)||m.get(this).set(a,new l(a)),m.get(this).get(a)):void 0}},{key:"removePictogram",value:function(a){m.get(this)["delete"](a.svgElement)}},{key:"remove",value:function(){i(n.get(this)),m["delete"](this),n["delete"](this)}}]),a}(),a("default",o)}}}),System.register("uxon/components/Theme.js",["npm:systemjs-plugin-babel@0.0.2/babel-helpers/classCallCheck.js","npm:systemjs-plugin-babel@0.0.2/babel-helpers/createClass.js","../errors.js","../misc/utils.js","./IconCollection.js","./Sprite.js"],function(a){"use strict";function b(a,b){return Math.max(a,b)-Math.min(a,b)}function c(a,b,c){return a>=b&&c>=a}function d(a,b){this.min=parseInt(a),this.max=parseInt(b),isNaN(this.min)&&(this.min=-1),isNaN(this.max)&&(this.max=Number.MAX_VALUE)}function e(a,c,d){if(!c)return d;if(!d)return c;var e=c.sizeRange,f=d.sizeRange,g=b(a,(e[0]+e[1])/2),h=b(a,(f[0]+f[1])/2);return g===h?d.container.contains(c.container)?c:d:g>h?d:c}var f,g,h,i,j,k,l,m,n,o,p,q,r,s;return{setters:[function(a){f=a["default"]},function(a){g=a["default"]},function(a){h=a.InvalidArgument},function(a){i=a.$body,j=a.$$,k=a.isInPage},function(a){l=a["default"]},function(a){m=a["default"]}],execute:function(){n=new l,o=function(){var a=new WeakMap,b=function(b,d){var f=b.getRefSize();return c(f,d.sizeRange.min,d.sizeRange.max)&&e(f,d,a.get(b))===d?(a.set(b,d),!0):!1};return b}(),p=new WeakMap,q=new WeakMap,r=new WeakMap,s=function(){function a(b,c){if(f(this,a),!(b instanceof m))throw new h("must be a Sprite Component");p.set(this,k(c)?c:i),r.set(this,b),q.set(this,new d),Object.defineProperties(this,{container:{get:function(){return p.get(this)}},sprite:{get:function(){return r.get(this)}}})}return g(a,[{key:"clone",value:function(){var b=new a(this.sprite,this.container);return b.sizeRange=this.sizeRange,b}},{key:"render",value:function(){j("*[data-icon]",this.container).forEach(function(a){var b=n.load(a);if(o(b,this)){var c=this.sprite.findPictogram(b.meta.get("icon"));b.draw(c)}},this)}},{key:"sizeRange",get:function(){return q.get(this)},set:function(a){var b=-1,c=-1;Array.isArray(a)?(b=a[0],c=a[1]):(b=a.min||-1,c=a.max||-1),q.set(this,new d(b,c))}}]),a}(),a("default",s)}}}),System.register("uxon/main.js",["weakmap","./loader.js","./components/Icon.js","./components/Pictogram.js","./components/Sprite.js","./components/Theme.js"],function(a){"use strict";var b,c,d,e,f,g,h,i,j;return{setters:[function(a){},function(a){b=a["default"]},function(a){c=a["default"]},function(a){d=a["default"]},function(a){e=a["default"]},function(a){f=a["default"]}],execute:function(){g={Icon:c,Pictogram:d,Sprite:e,Theme:f},h=function(a,b){return new Promise(function(c,d){try{var e=new g.Sprite(a),f=new g.Theme(e);c(f,b)}catch(h){d(h)}})},i=function(a,c){return new Promise(function(d,e){try{!function(){var f=b(a);f.onsuccess=function(a){h(a,c.container).then(function(a){c.sizeRange&&(a.sizeRange=c.sizeRange),c.autorun&&a.render(),d(a)},function(a){e(a)})},f.onerror=e,c.headers&&c.headers.foreach(function(a,b){f.addHeader(a,b)}),f.send()}()}catch(f){e(f)}})},j=function(a){return i(a,{autorun:!0})},a("components",g),a("autoload",j),a("load",i),a("make",h)}}});
//# sourceMappingURL=uxon-bundle.js.map