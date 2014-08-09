var assert = require('assert'),
    React = require('react'),
    RouterMixin = require('./../lib/RouterMixin');

var App = React.createClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home'
    },

    render: function() {
        return this.renderCurrentRoute();
    },

    home: function() {
        return React.DOM.div({ className: 'foo' }, 'test');
    },

    notFound: function(path) {
        return React.DOM.div({ className: 'not-found'}, path);
    }

});

var SimpleApp = React.createClass({

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

describe('RouterMixin', function() {

    beforeEach(function() {
       $('body').append('<div class="app"></div>');
    });

    afterEach(function() {
        $('.app').remove();
    });

    it('Should render the route that matches the path prop.', function() {
        React.renderComponent(
            App({ path: '/' }),
            $('.app').get(0)
        );

        assert.equal($('.foo').length, 1);
    });

    it('Should throw an error if no route matches and a notFound handler does not exist.', function() {
        assert.throws(
            function() {
                React.renderComponent(
                    SimpleApp({ path: '/bogus' }),
                    $('.app').get(0)
                );
            },
            /No route matched path: \/bogus/
        );
    });

    it('Should render the notFound handler if no route exists.', function() {
        React.renderComponent(
            App({ path: '/bogus' }),
            $('.app').get(0)
        );

        assert.equal($('.not-found').length, 1);
    });

});
