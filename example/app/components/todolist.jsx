var React = require('react'),
    Fluxxor = require('fluxxor'),
    RouterMixin = require('./../../../lib/RouterMixin'),
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
	        <div>
		        <h2>{list.name}</h2>
	            {this.renderCurrentRoute()}
	        </div>
        );
    },

	showAll: function() {
		var list = this.props.list;

		return (
			<ul>
	            {_map(list.todos, function(todo) {
		            return <li key={todo.id}>{todo.text}</li>;
	            })}
			</ul>
		)
	},

	createTodo: function() {
		return null;
	}

});

module.exports = TodoList;
