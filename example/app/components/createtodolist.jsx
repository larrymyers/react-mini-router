var React = require('react'),
    Fluxxor = require('fluxxor');

var CreateTodoList = React.createClass({

    mixins: [Fluxxor.FluxMixin(React)],

    render: function() {
        return (
            <form className="form-inline" onSubmit={this.createList}>
                <input className="create-list-input form-control" ref="listName" defaultValue=""/>
                <button className="btn btn-primary" type="submit">Create New List</button>
            </form>
        );
    },

    createList: function(evt) {
        evt.preventDefault();

        var input = this.refs.listName,
            listName = input.value;

        input.value = '';
        this.getFlux().actions.createList(listName);
    }
});

module.exports = CreateTodoList;
