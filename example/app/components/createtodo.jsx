var React = require('react'),
    Fluxxor = require('fluxxor');

var CreateTodo = React.createClass({

    mixins: [Fluxxor.FluxMixin(React)],

    render: function() {
        return (
            <form className="form-inline" onSubmit={this.createTodo}>
                <input className="create-list-input form-control" ref="text" defaultValue=""/>
                <button className="btn btn-primary" type="submit">Save</button>
            </form>
        );
    },

    createTodo: function(evt) {
        evt.preventDefault();

        var input = this.refs.text,
            text = input.value;

        input.value = '';
        this.getFlux().actions.addTodo(this.props.list, text);
    }
});

module.exports = CreateTodo;
