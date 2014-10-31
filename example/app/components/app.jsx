var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    RouterMixin = require('./../../../lib/RouterMixin'),
    TodoList = require('./todolist'),
    TodoForm = require('./todoform');

var App = React.createClass({

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
        return <div>{this.renderCurrentRoute()}</div>;
    },

    viewAllTodos: function() {
        return (
            <div>
                <a href="/todos/new">Create New Todo</a>
                <TodoList todos={this.state.todos}/>
            </div>
        );
    },

    createTodo: function() {
        return <TodoForm/>
    },

    viewTodo: function(todoId) {

    },

    editTodo: function(todoId) {

    },

    notFound: function(path) {
        return <div class="not-found">Uh oh. You've arrived somewhere that doesn't exist.</div>;
    }

});

module.exports = App;
