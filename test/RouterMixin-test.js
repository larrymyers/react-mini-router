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

});
