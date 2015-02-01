var React = require('react'),
    Fluxxor = require('fluxxor'),
    RouterMixin = require('./../../../lib/RouterMixin'),
    CreateTodo = require('./createtodo'),
    _map = require('lodash-node/modern/collections/map');

var TodoList = React.createClass({

	mixins: [RouterMixin, Fluxxor.FluxMixin(React)],

	routes: {
		'/': 'showAll',
		'/create': 'createTodo',
		'/edit/:id': 'editTodo'
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

	showAll: function() {
		var list = this.props.list;

		return (
            <div>
                <ul className="list-group">
	            {_map(list.todos, function(todo) {
                    return <li className="list-group-item" key={todo.id}>{todo.text}</li>;
                })}
                </ul>
                <CreateTodo list={list}/>
            </div>
		);
	},

	createTodo: function() {
		return null;
	}

});

module.exports = TodoList;
