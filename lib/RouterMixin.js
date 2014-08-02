var pathToRegexp = require('path-to-regexp'),
    URL = require('url'),
    ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

module.exports = {

    getInitialState: function() {
        return {
            path: this.props.path
        };
    },

    componentWillMount: function() {
        this.setState({ _routes: processRoutes(this.routes || {}, this) });
    },

    componentDidMount: function() {
        this.getDOMNode().addEventListener('click', this.handleClick, false);
        window.addEventListener('popstate', this.onPopState, false);
    },

    componentWillUnmount: function() {
        this.getDOMNode().removeEventListener('click', this.handleClick);
        window.removeEventListener('popstate', this.onPopState);
    },

    onPopState: function() {
        var url = URL.parse(window.location.href, true);

        if (this.matchRoute(url.pathname)) {
            this.setState({ path: url.pathname });
        }
    },

    renderCurrentRoute: function() {
        var path = this.state.path,
            url;

        if (path) {
            url = URL.parse(path, true);
        } else if (!path && ExecutionEnvironment.canUseDOM) {
            url = URL.parse(window.location.href, true);
        } else {
            // TODO throw error? default to root?
        }

        var matchedRoute = this.matchRoute(url.pathname);

        // TODO if matchedRoute is null, render a 404

        return matchedRoute.handler.apply(this, matchedRoute.params.concat(url.query));
    },

    handleClick: function(evt) {
        var self = this,
            uri = getHref(evt);

        if (uri && self.matchRoute(uri.pathname)) {
            evt.preventDefault();

            // See: http://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html
            // Give any component event listeners a chance to fire in the current event loop,
            // since they happen at the end of the bubbling phase. (Allows an onClick prop to
            // work correctly on the event target <a/> component.)
            setTimeout(function() {
                window.history.pushState({}, '', uri.pathname);
                self.setState({ path: uri.pathname });
            }, 0);
        }
    },

    matchRoute: function(path) {
        if (!path) return false;

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

        return matchedRoute;
    }

};

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

    var linkURL = URL.parse(elt.href);
    var windowURL = URL.parse(window.location.href);

    if (linkURL.protocol !== windowURL.protocol || linkURL.host !== windowURL.host) {
        return;
    }

    return linkURL;
}

function processRoutes(routes, component) {
    var patterns = [],
        path, pattern, keys, handler, handlerFn;

    for (path in routes) {
        if (routes.hasOwnProperty(path)) {
            keys = [];
            pattern = pathToRegexp(path, keys);
            handler = routes[path];
            handlerFn = component[handler];

            patterns.push({ pattern: pattern, params: keys, handler: handlerFn });
        }
    }

    return patterns;
}
