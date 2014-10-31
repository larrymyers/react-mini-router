var assert = require('assert'),
    sinon = require('sinon'),
    React = require('react/addons'),
    ReactTestUtils = React.addons.TestUtils,
    RouterMixin = require('./../lib/RouterMixin'),
    navigate = require('./../lib/navigate');

var App, AppWithoutNotFound;

describe('RouterMixin', function() {

    beforeEach(function() {
       $('body').append('<div class="app"></div>');
    });

    afterEach(function() {
        $('.app').remove();
    });

    it('Should render the route that matches the path prop.', function() {
        React.render(
            App({ path: '/' }),
            $('.app').get(0)
        );

        assert.equal($('.foo').length, 1);
    });

    it('Should preprend an optional root to each route, and match on the resulting path.', function() {
        React.render(
            App({ root: '/foo', path: '/foo/' }),
            $('.app').get(0)
        );

        assert.equal($('.foo').length, 1);
    });

    it('Should throw an error if no route matches and a notFound handler does not exist.', function() {
        assert.throws(
            function() {
                React.render(
                    AppWithoutNotFound({ path: '/bogus' }),
                    $('.app').get(0)
                );
            },
            /No route matched path: \/bogus/
        );
    });

    it('Should render the notFound handler if no route exists.', function() {
        React.render(
            App({ path: '/bogus' }),
            $('.app').get(0)
        );

        assert.equal($('.not-found').length, 1);
    });

    it('Should pass matched params and the parsed query string to the router handler.', function() {
        var instance = ReactTestUtils.renderIntoDocument(App({ path: '/' }));
        var spy = sinon.spy(instance.state._routes[1].handler);
        instance.state._routes[1].handler = spy;

        instance.setState({ path: '/search/foo?bar=baz%20baz'});

        assert.ok(spy.called);

        var args = spy.args[0];

        assert.equal(args[0], 'foo');
        assert.deepEqual(args[1], { 'bar': 'baz baz' });
    });

    it('Should render the matched route when the hash url changes.', function(done) {
        React.render(
            App({ path: '/' }),
            $('.app').get(0)
        );

        window.location.hash = '#!/search/foo';

        setTimeout(function() {
            assert.equal($('.search-results').length, 1);
            done();
        }, 100);
    });

    // TODO when PhantomJS 2.0 is out, we'll have pushState support, implement a test for it then.
});

var AppClass = React.createClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home',
        '/search/:searchQuery': 'searchResults'
    },

    render: function() {
        return this.renderCurrentRoute();
    },

    home: function() {
        return React.DOM.div({ className: 'foo' }, 'test');
    },

    searchResults: function(searchQuery, params) {
        return React.DOM.div({ className: 'search-results'}, searchQuery);
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
        return React.DOM.div(null, 'test');
    }

});

App = React.createFactory(AppClass);
AppWithoutNotFound = React.createFactory(AppWithoutNotFoundClass);
