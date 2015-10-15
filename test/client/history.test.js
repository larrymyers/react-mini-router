/* global describe:true, it:true, beforeEach:true, afterEach:true */

var assert = require('assert'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    RouterMixin = require('./../../lib/RouterMixin'),
    navigate = require('./../../lib/navigate');

var App, NestedApp;

describe('RouterMixin', function() {

    beforeEach(function() {
       $('body').append('<div class="app"></div>');
    });

    afterEach(function() {
        var $root = $('.app');
        ReactDOM.unmountComponentAtNode($root.get(0));
        $root.remove();
        setHash('');
    });

    function setHash(url) {
        window.location.hash = '#!' + url;
    }

    it('Should set the initial path to the root when there is no hash and no History API.', function(done) {
        window.location.hash = '';

        ReactDOM.render(
            App(),
            $('.app').get(0)
        );

        assert.equal($('.home').length, 1);
        assert.equal($('.nested').length, 0);
        done();
    });

    it('Should set the initial path to the hash with query params.', function(done) {
        setHash('/search?q=1');

        ReactDOM.render(
            App(),
            $('.app').get(0)
        );

        assert.equal($('.search').length, 1);
        assert.equal($('.search').text(), '1');
        done();
    });

    it('Should render the matched route when the hash url changes.', function(done) {
        setHash('/');

        ReactDOM.render(
            App(),
            $('.app').get(0)
        );

        assert.equal($('.home').length, 1);
        assert.equal($('.nested').length, 0);

        setHash('/nested/');

        setTimeout(function() {
            assert.equal($('.home').length, 0);
            assert.equal($('.nested').length, 1);
            done();
        }, 100);
    });

    it('Should render the matched route when the url changes and history support is enabled.', function() {
        // TODO create a pushState test, but detect the functionality first since phantomjs won't
        // have history API support until 2.0.
    });

    it('Should trigger a route when navigate is called with a routable url.', function() {

    });

    it('Should trigger a route when a link is clicked on with a routable href.', function() {
        // TODO make sure propagation is stopped correctly so a handler matches
        // on the correct app (with nesting)
    });

});

var AppClass = React.createClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home',
        '/nested/:path*': 'nestedApp',
        '/search': 'search'
    },

    render: function() {
        return this.renderCurrentRoute();
    },

    home: function() {
        return React.DOM.div({ className: 'home' }, 'root home');
    },

    nestedApp: function() {
        return NestedApp({ root: '/nested' });
    },

    search: function(params) {
        return React.DOM.div({ className: 'search' }, params.q);
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
        return React.DOM.div({ className: 'nested' }, 'nested home');
    }

});

App = React.createFactory(AppClass);
NestedApp = React.createFactory(NestedAppClass);
