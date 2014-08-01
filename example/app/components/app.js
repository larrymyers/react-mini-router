/**
 * @jsx React.DOM
 */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    RouterMixin = require('./../../../lib/RouterMixin'),
    TodoList = require('./todolist'),
    TodoForm = require('./todoform');

var App = React.createClass({displayName: 'App',

    routes: {
        '/': 'viewAllTodos',
        '/todos/new': 'createTodo',
        '/todos/:todoId': 'viewTodo',
        '/todos/:todoId/edit': 'editTodo'
    },

    mixins: [RouterMixin, FluxMixin, StoreWatchMixin('TodoStore')],

    getStateFromFlux: function() {
        return this.getFlux().store('TodoStore').getState();
    },

    render: function() {
        return React.DOM.div(null, this.renderCurrentRoute());
    },

    viewAllTodos: function() {
        return (
            React.DOM.div(null, 
                React.DOM.a({href: "/todos/new"}, "Create New Todo"), 
                TodoList({todos: this.state.todos})
            )
        );
    },

    createTodo: function() {
        return TodoForm(null)
    },

    viewTodo: function(todoId) {

    },

    editTodo: function(todoId) {

    }

});

module.exports = App;
