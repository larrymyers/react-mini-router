var React = require('react'),
    navigate = require('./../../../lib/navigate'),
    Fluxxor = require('fluxxor'),
    FluxChildMixin = Fluxxor.FluxChildMixin(React);

var TodoForm = React.createClass({

    mixins: [FluxChildMixin],

    componentDidMount: function() {
        this.componentDidUpdate();
    },

    componentDidUpdate: function() {
        this.refs.textInput.getDOMNode().focus();
    },

    render: function() {
        return (
            <form onSubmit={this.submit}>
                <input type="text" placeholder="Enter Task" ref="textInput"/>
                <button type="submit">Save</button>
            </form>
        );
    },

    submit: function(evt) {
        evt.preventDefault();
        var text = this.refs.textInput.getDOMNode().value;
        this.getFlux().actions.addTodo(text);
        navigate('/');
    }
});

module.exports = TodoForm;
