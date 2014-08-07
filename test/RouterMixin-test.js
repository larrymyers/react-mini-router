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
        return React.DOM.div(null, 'test');
    }

});

describe('RouterMixin', function() {

    it('Should parse the routes on the component when mounting.', function() {
        var app = App({ path: '/' });
        var html = React.renderComponentToString(app);

        assert.equal(html, '<div data-reactid=".0" data-react-checksum="-1097856244">test</div>');
        assert.equal(app._routes.length, 1);
    });

});
