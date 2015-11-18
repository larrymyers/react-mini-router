var EventListener = require('fbjs/lib/EventListener'),
    getEventTarget = require('react/lib/getEventTarget'),
    pathToRegexp = require('path-to-regexp'),
    urllite = require('urllite/lib/core'),
    detect = require('./detect');


function Router(routes, onChangeCallback, options) {
    this.onChangeCallback = onChangeCallback;
    this.window = options.window || window;
    this.root = options.root || options.path || '';
    this.useHistory = options.useHistory || false;
    this.path = getInitialPath(options);
    this.routes = processRoutes(this.root, routes);
}

Router.prototype.onChange = function() {
    var window = this.window,
        url = urllite(window.location.href),
        hash = url.hash || '',
        path = this.useHistory ? url.pathname : hash.slice(2);

    if (path.length === 0) path = '/';

    this.onChangeCallback(path + url.search);
};

Router.prototype.handleClick = function(evt) {
    var self = this,
        url = getHref(evt);

    if (url && self.matchRoute(url.pathname)) {
        if(evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }

        // See: http://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html
        // Give any component event listeners a chance to fire in the current event loop,
        // since they happen at the end of the bubbling phase. (Allows an onClick prop to
        // work correctly on the event target <a/> component.)
        setTimeout(function() {
            var pathWithSearch = url.pathname + (url.search || '');
            if (pathWithSearch.length === 0) pathWithSearch = '/';

            if (self.useHistory) {
                self.window.history.pushState({}, '', pathWithSearch);
            } else {
                self.window.location.hash = '!' + pathWithSearch;
            }

            self.onChangeCallback(pathWithSearch);
        }, 0);
    }
};

Router.prototype.matchRoute = function(path) {
    if (!path) {
        return false;
    }

    var matchedRoute = {};

    this.routes.some(function(route) {
        var matches = route.pattern.exec(path);

        if (matches) {
            matchedRoute.handler = route.handler;
            matchedRoute.params = matches.slice(1, route.params.length + 1);

            return true;
        }

        return false;
    });

    return matchedRoute.handler ? matchedRoute : false;
};

module.exports = Router;

function getInitialPath(options) {
    var path = options.path,
        hash,
        url;

    if (!path && detect.canUseDOM) {
        url = urllite(self.window.location.href);

        if (options.history) {
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

    var elt = getEventTarget(evt);

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
    var windowURL = urllite(self.window.location.href);

    if (linkURL.protocol !== windowURL.protocol || linkURL.host !== windowURL.host) {
        return;
    }

    return linkURL;
}

function processRoutes(root, routes) {
    var patterns = [],
        path, pattern, keys, handler;

    for (path in routes) {
        if (routes.hasOwnProperty(path)) {
            keys = [];
            pattern = pathToRegexp(root + path, keys);
            handler = routes[path];

            patterns.push({ pattern: pattern, params: keys });
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
