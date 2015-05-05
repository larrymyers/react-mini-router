var React = require('react'),
    Fluxxor = require('fluxxor'),
    RouterMixin = require('./../../../lib/RouterMixin'),
    CreateTodo = require('./createtodo'),
    _find = require('lodash/collection/find'),
    _map = require('lodash/collection/map');

var TodoList = React.createClass({

	mixins: [RouterMixin, Fluxxor.FluxMixin(React)],

	routes: {
		'/': 'showAll',
		'/edit/:id': 'showAll'
	},

    render: function () {
	    var list = this.props.list;

        return (
	        <div className="todolist">
		        <h2>{list.name}</h2>
	            {this.renderCurrentRoute()}
                <footer>
                    <a href="/">Back to All Lists</a>
                </footer>
	        </div>
        );
    },

	showAll: function(id) {
		var self = this,
            list = self.props.list,
            editTodo;

        if (id) {
            editTodo = _find(list.todos, { id: parseInt(id) });
        }

		return (
            <div>
                <ul className="list-group">
	            {_map(list.todos, function(todo) {
                    if (todo === editTodo) {
                        return (
                            <li className="list-group-item" key={todo.id + ':edit'}>
                                <form onSubmit={self.saveTodo.bind(self, todo.id)}>
                                    <input ref="editInput" defaultValue={todo.text}/>
                                    <button type="submit">Save</button>
                                </form>
                            </li>
                        );
                    }

                    return (
                        <li className="list-group-item" key={todo.id}>
                            <a href={'/lists/' + list.id + '/edit/' + todo.id}>{todo.text}</a>
                        </li>
                    );
                })}
                </ul>
                <CreateTodo list={list}/>
            </div>
		);
	},

    saveTodo: function(id, evt) {
        evt.preventDefault();

        var list = this.props.list,
            todo = _find(list.todos, { id: id });

        todo.text = this.refs.editInput.getDOMNode().value;

        this.getFlux().actions.updateTodo(list, todo);
    }

});

module.exports = TodoList;
