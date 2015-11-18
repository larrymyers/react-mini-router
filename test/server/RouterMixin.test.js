/* global describe:true, it:true */

var assert = require('assert'),
    cheerio = require('cheerio'),
    React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    RouterMixin = require('./../../lib/RouterMixin');

describe('RouterMixin', function() {

    it('Should render the route that matches the path prop.', function() {
        var html = ReactDOMServer.renderToString(App({ path: '/search/foo' })),
            $ = cheerio.load(html);

        var $el = $('.search-results');
        assert.equal($el.length, 1);
        assert.equal($el.text(), 'foo');
    });

    it('Should default path to the url root if it is not passed as a prop.', function() {
        var html = ReactDOMServer.renderToString(App()),
            $ = cheerio.load(html);

        assert.equal($('.home').length, 1);
    });

    it('Should preprend an optional root to each route, and match on the resulting path.', function() {
        var html = ReactDOMServer.renderToString(App({ root: '/bar', path: '/bar/search/foo' })),
            $ = cheerio.load(html);

        var $el = $('.search-results');
        assert.equal($el.length, 1);
        assert.equal($el.text(), 'foo');
    });

    it('Should render the notFound handler if no matching route exists.', function() {
        var html = ReactDOMServer.renderToString(App({ path: '/bogus' })),
            $ = cheerio.load(html);

        assert.equal($('.not-found').length, 1);
    });

    it('Should throw an error if no route matches and a notFound handler does not exist.', function() {
        assert.throws(
            function() {
                ReactDOMServer.renderToString(AppWithoutNotFound({ path: '/bogus' }));
            },
            /No route matched path: \/bogus/
        );
    });

    it('Should pass matched params and the parsed query string to the router handler.', function() {

    });

    it('Should render the nested app.', function() {
        var html = ReactDOMServer.renderToString(App({ path: '/nested' })),
            $ = cheerio.load(html);

        assert.equal($('.nested').length, 1);
    });

});

var AppClass = React.createClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home',
        '/search/:searchQuery': 'searchResults',
        '/nested/:path*': 'nestedApp'
    },

    render: function() {
        return this.renderCurrentRoute();
    },

    home: function() {
        return React.DOM.div({ className: 'home' }, 'home content');
    },

    searchResults: function(searchQuery, params) {
        return React.DOM.div({ className: 'search-results'}, searchQuery);
    },

    nestedApp: function() {
        return NestedApp({ root: '/nested' });
    },

    notFound: function(path) {
        return React.DOM.div({ className: 'not-found'}, path);
    }

});

var AppWithoutNotFoundClass = React.createClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home'
    },

    render: function() {
        return this.renderCurrentRoute();
    },

    home: function() {
        return React.DOM.div(null);
    }

});

var NestedAppClass = React.createClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home'
    },

    render: function() {
        return this.renderCurrentRoute();
    },

    home: function() {
        return React.DOM.div({ className: 'nested' }, 'test');
    }

});

App = React.createFactory(AppClass);
AppWithoutNotFound = React.createFactory(AppWithoutNotFoundClass);
NestedApp = React.createFactory(NestedAppClass);
