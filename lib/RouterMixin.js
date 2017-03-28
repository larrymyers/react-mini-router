var React = require('react'),
    ReactDOM = require('react-dom'),
    EventListener = require('fbjs/lib/EventListener'),
    getEventTarget = require('./getEventTarget'),
    pathToRegexp = require('path-to-regexp'),
    urllite = require('urllite/lib/core'),
    detect = require('./detect');

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

        _events.push(EventListener.listen(ReactDOM.findDOMNode(this), 'click', this.handleClick));

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
