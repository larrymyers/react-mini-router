var React = require('react'),
    navigate = require('./../../../lib/navigate'),
    Fluxxor = require('fluxxor');

var TodoForm = React.createClass({

    mixins: [Fluxxor.FluxMixin(React)],

    componentDidMount: function() {
        this.componentDidUpdate();
    },

    componentDidUpdate: function() {
        this.refs.textInput.focus();
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
        var text = this.refs.textInput.value;
        this.getFlux().actions.addTodo(text);
        navigate('/');
    }
});

module.exports = TodoForm;
