/*! ReactMiniRouter 1.1.6 - https://github.com/larrymyers/react-mini-router */
var ReactMiniRouter =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    RouterMixin: __webpack_require__(1),
	    navigate: __webpack_require__(2)
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3),
	    EventListener = __webpack_require__(7),
	    pathToRegexp = __webpack_require__(6),
	    urllite = __webpack_require__(8),
	    detect = __webpack_require__(4);

	var PropValidation = {
	    path: React.PropTypes.string,
	    root: React.PropTypes.string,
	    useHistory: React.PropTypes.bool
	};

	module.exports = {

	    propTypes: PropValidation,

	    contextTypes: PropValidation,

	    childContextTypes: PropValidation,

	    getChildContext: function() {
	        return {
	            path: this.state.path,
	            root: this.state.root,
	            useHistory: this.state.useHistory
	        }
	    },

	    getDefaultProps: function() {
	        return {
	            routes: {}
	        };
	    },

	    getInitialState: function() {
	        return {
	            path: getInitialPath(this),
	            root: this.props.root || this.context.path || '',
	            useHistory: (this.props.history || this.context.useHistory) && detect.hasPushState
	        };
	    },

	    componentWillMount: function() {
	        this.setState({ _routes: processRoutes(this.state.root, this.routes, this) });
	    },

	    componentDidMount: function() {
	        var _events = this._events = [];

	        _events.push(EventListener.listen(this.getDOMNode(), 'click', this.handleClick));

	        if (this.state.useHistory) {
	            _events.push(EventListener.listen(window, 'popstate', this.onPopState));
	        } else {
	            if (window.location.hash.indexOf('#!') === -1) {
	                window.location.hash = '#!/';
	            }

	            _events.push(EventListener.listen(window, 'hashchange', this.onPopState));
	        }
	    },

	    componentWillUnmount: function() {
	        this._events.forEach(function(listener) {
	           listener.remove();
	        });
	    },

	    onPopState: function() {
	        var url = urllite(window.location.href),
	            hash = url.hash || '',
	            path = this.state.useHistory ? url.pathname : hash.slice(2);

	        if (path.length === 0) path = '/';

	        this.setState({ path: path + url.search });
	    },

	    renderCurrentRoute: function() {
	        var path = this.state.path,
	            url = urllite(path),
	            queryParams = parseSearch(url.search);

	        var parsedPath = url.pathname;

	        if (!parsedPath || parsedPath.length === 0) parsedPath = '/';

	        var matchedRoute = this.matchRoute(parsedPath);

	        if (matchedRoute) {
	            return matchedRoute.handler.apply(this, matchedRoute.params.concat(queryParams));
	        } else if (this.notFound) {
	            return this.notFound(parsedPath, queryParams);
	        } else {
	            throw new Error('No route matched path: ' + parsedPath);
	        }
	    },

	    handleClick: function(evt) {
	        var self = this,
	            url = getHref(evt);

	        if (url && self.matchRoute(url.pathname)) {
	            evt.preventDefault();

	            // See: http://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html
	            // Give any component event listeners a chance to fire in the current event loop,
	            // since they happen at the end of the bubbling phase. (Allows an onClick prop to
	            // work correctly on the event target <a/> component.)
	            setTimeout(function() {
	                var pathWithSearch = url.pathname + (url.search || '');
	                if (pathWithSearch.length === 0) pathWithSearch = '/';

	                if (self.state.useHistory) {
	                    window.history.pushState({}, '', pathWithSearch);
	                } else {
	                    window.location.hash = '!' + pathWithSearch;
	                }

	                self.setState({ path: pathWithSearch});
	            }, 0);
	        }
	    },

	    matchRoute: function(path) {
	        if (!path) {
	            return false;
	        }

	        var matchedRoute = {};

	        this.state._routes.some(function(route) {
	            var matches = route.pattern.exec(path);

	            if (matches) {
	                matchedRoute.handler = route.handler;
	                matchedRoute.params = matches.slice(1, route.params.length + 1);

	                return true;
	            }

	            return false;
	        });

	        return matchedRoute.handler ? matchedRoute : false;
	    }

	};

	function getInitialPath(component) {
	    var path = component.props.path || component.context.path,
	        hash,
	        url;

	    if (!path && detect.canUseDOM) {
	        url = urllite(window.location.href);

	        if (component.props.history) {
	            path = url.pathname + url.search;
	        } else if (url.hash) {
	            hash = urllite(url.hash.slice(2));
	            path = hash.pathname + hash.search;
	        }
	    }

	    return path || '/';
	}

	function getHref(evt) {
	    if (evt.defaultPrevented) {
	        return;
	    }

	    if (evt.metaKey || evt.ctrlKey || evt.shiftKey) {
	        return;
	    }

	    if (evt.button !== 0) {
	        return;
	    }

	    var elt = evt.target;

	    // Since a click could originate from a child element of the <a> tag,
	    // walk back up the tree to find it.
	    while (elt && elt.nodeName !== 'A') {
	        elt = elt.parentNode;
	    }

	    if (!elt) {
	        return;
	    }

	    if (elt.target && elt.target !== '_self') {
	        return;
	    }

	    if (!!elt.attributes.download) {
	        return;
	    }

	    var linkURL = urllite(elt.href);
	    var windowURL = urllite(window.location.href);

	    if (linkURL.protocol !== windowURL.protocol || linkURL.host !== windowURL.host) {
	        return;
	    }

	    return linkURL;
	}

	function processRoutes(root, routes, component) {
	    var patterns = [],
	        path, pattern, keys, handler, handlerFn;

	    for (path in routes) {
	        if (routes.hasOwnProperty(path)) {
	            keys = [];
	            pattern = pathToRegexp(root + path, keys);
	            handler = routes[path];
	            handlerFn = component[handler];

	            patterns.push({ pattern: pattern, params: keys, handler: handlerFn });
	        }
	    }

	    return patterns;
	}

	function parseSearch(str) {
	    var parsed = {};

	    if (str.indexOf('?') === 0) str = str.slice(1);

	    var pairs = str.split('&');

	    pairs.forEach(function(pair) {
	        var keyVal = pair.split('=');

	        parsed[decodeURIComponent(keyVal[0])] = decodeURIComponent(keyVal[1]);
	    });

	    return parsed;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var detect = __webpack_require__(4);
	var event = __webpack_require__(5);

	module.exports = function triggerUrl(url, silent) {
	    if (detect.hasHashbang()) {
	        window.location.hash = '#!' + url;
	    } else if (detect.hasPushState) {
	        window.history.pushState({}, '', url);
	        if (!silent) {
	            window.dispatchEvent(event.createEvent('popstate'));
	        }
	    } else {
	        console.error("Browser does not support pushState, and hash is missing a hashbang prefix!");
	    }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var canUseDOM = !!(
	    typeof window !== 'undefined' &&
	    window.document &&
	    window.document.createElement
	);

	module.exports = {
	    canUseDOM: canUseDOM,
	    hasPushState: canUseDOM && window.history && 'pushState' in window.history,
	    hasHashbang: function() {
	        return canUseDOM && window.location.hash.indexOf('#!') === 0;
	    },
	    hasEventConstructor: function() {
	        return typeof window.Event == "function";
	    }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var detect = __webpack_require__(4);

	module.exports = {
	    createEvent: function(name) {
	        if (detect.hasEventConstructor()) {
	            return new window.Event(name);
	        } else {
	            var event = document.createEvent('Event');
	            event.initEvent(name, true, false);
	            return event;
	        }
	    }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(10);

	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp;

	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match escaped characters that would otherwise appear in future matches.
	  // This allows the user to escape special characters that won't transform.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
	  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
	  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
	  // Match regexp special characters that are always escaped.
	  '([.+*?=^!:${}()[\\]|\\/])'
	].join('|'), 'g');

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1');
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys;
	  return re;
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {String}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i';
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {RegExp} path
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function regexpToRegexp (path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g);

	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name:      i,
	        delimiter: null,
	        optional:  false,
	        repeat:    false
	      });
	    }
	  }

	  return attachKeys(path, keys);
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {Array}  path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function arrayToRegexp (path, keys, options) {
	  var parts = [];

	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source);
	  }

	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
	  return attachKeys(regexp, keys);
	}

	/**
	 * Replace the specific tags with regexp strings.
	 *
	 * @param  {String} path
	 * @param  {Array}  keys
	 * @return {String}
	 */
	function replacePath (path, keys) {
	  var index = 0;

	  function replace (_, escaped, prefix, key, capture, group, suffix, escape) {
	    if (escaped) {
	      return escaped;
	    }

	    if (escape) {
	      return '\\' + escape;
	    }

	    var repeat   = suffix === '+' || suffix === '*';
	    var optional = suffix === '?' || suffix === '*';

	    keys.push({
	      name:      key || index++,
	      delimiter: prefix || '/',
	      optional:  optional,
	      repeat:    repeat
	    });

	    prefix = prefix ? ('\\' + prefix) : '';
	    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

	    if (repeat) {
	      capture = capture + '(?:' + prefix + capture + ')*';
	    }

	    if (optional) {
	      return '(?:' + prefix + '(' + capture + '))?';
	    }

	    // Basic parameter support.
	    return prefix + '(' + capture + ')';
	  }

	  return path.replace(PATH_REGEXP, replace);
	}

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(String|RegExp|Array)} path
	 * @param  {Array}                 [keys]
	 * @param  {Object}                [options]
	 * @return {RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  keys = keys || [];

	  if (!isArray(keys)) {
	    options = keys;
	    keys = [];
	  } else if (!options) {
	    options = {};
	  }

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, keys, options);
	  }

	  if (isArray(path)) {
	    return arrayToRegexp(path, keys, options);
	  }

	  var strict = options.strict;
	  var end = options.end !== false;
	  var route = replacePath(path, keys);
	  var endsWithSlash = path.charAt(path.length - 1) === '/';

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
	  }

	  if (end) {
	    route += '$';
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
	  }

	  return attachKeys(new RegExp('^' + route, flags(options)), keys);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule EventListener
	 * @typechecks
	 */

	var emptyFunction = __webpack_require__(9);

	/**
	 * Upstream version of event listener. Does not take into account specific
	 * nature of platform.
	 */
	var EventListener = {
	  /**
	   * Listen to DOM events during the bubble phase.
	   *
	   * @param {DOMEventTarget} target DOM element to register listener on.
	   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
	   * @param {function} callback Callback function.
	   * @return {object} Object with a `remove` method.
	   */
	  listen: function(target, eventType, callback) {
	    if (target.addEventListener) {
	      target.addEventListener(eventType, callback, false);
	      return {
	        remove: function() {
	          target.removeEventListener(eventType, callback, false);
	        }
	      };
	    } else if (target.attachEvent) {
	      target.attachEvent('on' + eventType, callback);
	      return {
	        remove: function() {
	          target.detachEvent('on' + eventType, callback);
	        }
	      };
	    }
	  },

	  /**
	   * Listen to DOM events during the capture phase.
	   *
	   * @param {DOMEventTarget} target DOM element to register listener on.
	   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
	   * @param {function} callback Callback function.
	   * @return {object} Object with a `remove` method.
	   */
	  capture: function(target, eventType, callback) {
	    if (!target.addEventListener) {
	      if ("production" !== process.env.NODE_ENV) {
	        console.error(
	          'Attempted to listen to events during the capture phase on a ' +
	          'browser that does not support the capture phase. Your application ' +
	          'will not receive some events.'
	        );
	      }
	      return {
	        remove: emptyFunction
	      };
	    } else {
	      target.addEventListener(eventType, callback, true);
	      return {
	        remove: function() {
	          target.removeEventListener(eventType, callback, true);
	        }
	      };
	    }
	  },

	  registerDefault: function() {}
	};

	module.exports = EventListener;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var URL, URL_PATTERN, defaults, urllite,
	    __hasProp = {}.hasOwnProperty;

	  URL_PATTERN = /^(?:(?:([^:\/?\#]+:)\/+|(\/\/))(?:([a-z0-9-\._~%]+)(?::([a-z0-9-\._~%]+))?@)?(([a-z0-9-\._~%!$&'()*+,;=]+)(?::([0-9]+))?)?)?([^?\#]*?)(\?[^\#]*)?(\#.*)?$/;

	  urllite = function(raw, opts) {
	    return urllite.URL.parse(raw, opts);
	  };

	  urllite.URL = URL = (function() {
	    function URL(props) {
	      var k, v, _ref;
	      for (k in defaults) {
	        if (!__hasProp.call(defaults, k)) continue;
	        v = defaults[k];
	        this[k] = (_ref = props[k]) != null ? _ref : v;
	      }
	      this.host || (this.host = this.hostname && this.port ? "" + this.hostname + ":" + this.port : this.hostname ? this.hostname : '');
	      this.origin || (this.origin = this.protocol ? "" + this.protocol + "//" + this.host : '');
	      this.isAbsolutePathRelative = !this.host && this.pathname.charAt(0) === '/';
	      this.isPathRelative = !this.host && this.pathname.charAt(0) !== '/';
	      this.isRelative = this.isSchemeRelative || this.isAbsolutePathRelative || this.isPathRelative;
	      this.isAbsolute = !this.isRelative;
	    }

	    URL.parse = function(raw) {
	      var m, pathname, protocol;
	      m = raw.toString().match(URL_PATTERN);
	      pathname = m[8] || '';
	      protocol = m[1];
	      return new urllite.URL({
	        protocol: protocol,
	        username: m[3],
	        password: m[4],
	        hostname: m[6],
	        port: m[7],
	        pathname: protocol && pathname.charAt(0) !== '/' ? "/" + pathname : pathname,
	        search: m[9],
	        hash: m[10],
	        isSchemeRelative: m[2] != null
	      });
	    };

	    return URL;

	  })();

	  defaults = {
	    protocol: '',
	    username: '',
	    password: '',
	    host: '',
	    hostname: '',
	    port: '',
	    pathname: '',
	    search: '',
	    hash: '',
	    origin: '',
	    isSchemeRelative: false
	  };

	  module.exports = urllite;

	}).call(this);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyFunction
	 */

	function makeEmptyFunction(arg) {
	  return function() {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function() { return this; };
	emptyFunction.thatReturnsArgument = function(arg) { return arg; };

	module.exports = emptyFunction;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);