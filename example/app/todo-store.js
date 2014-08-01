var Fluxxor = require('fluxxor'),
    TodoService = require('./todo-service'),
    constants = require('./constants'),
    _remove = require('lodash-node/modern/arrays/remove'),
    _findIndex = require('lodash-node/modern/arrays/findIndex');

module.exports = Fluxxor.createStore({
    initialize: function(options) {
        this.todos = options.todos || [];

        this.bindActions(
            constants.ADD_TODO, this.onAddTodo,
            constants.UPDATE_TODO, this.onUpdateTodo,
            constants.REMOVE_TODO, this.onRemoveTodo
        );
    },

    onAddTodo: function(payload) {
        var self = this;

        TodoService.createTodo({ text: payload.text }, function(err, todo) {
            self.todos.push(todo);
            self.emit("change");
        });
    },

    onUpdateTodo: function(payload) {
        var i = _findIndex(this.todos, function(todo) { return todo.id === payload.id });
        this.todos[i] = payload;
        this.emit("change");
    },

    onRemoveTodo: function(payload) {
        _remove(this.todos, function(todo) { return todo.id === payload.id; });
        this.emit("change");
    },

    getState: function() {
        return {
            todos: this.todos
        };
    }
});
