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

    it('Should render the route that matches the path prop.', function() {
        var html = React.renderComponentToString(App({ path: '/' }));

        assert.equal(html, '<div data-reactid=".0" data-react-checksum="-1097856244">test</div>');
    });

});
