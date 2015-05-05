var Fluxxor = require('fluxxor'),
    constants = require('./constants'),
    _remove = require('lodash/array/remove'),
    _find = require('lodash/collection/find'),
    _findIndex = require('lodash/array/findIndex');

module.exports = Fluxxor.createStore({
    initialize: function(options) {
        this.lists = options.lists || [];

        this.bindActions(
            constants.ADD_LIST, this.onAddList,
            constants.DELETE_LIST, this.onDeleteList,
            constants.ADD_TODO, this.onAddTodo,
            constants.UPDATE_TODO, this.onUpdateTodo,
            constants.REMOVE_TODO, this.onRemoveTodo
        );
    },

    onAddList: function(list) {
        this.lists.push(list);
        this.emit('change');
    },

    onDeleteList: function(list) {

    },

    onAddTodo: function(payload) {
        var list = _find(this.lists, { id: payload.listId });
        list.todos.push(payload.todo);
        this.emit('change');
    },

    onUpdateTodo: function(payload) {
        var list = _find(this.lists, { id: payload.listId }),
            idx = _findIndex(list.todos, { id: payload.todo.id });

        if (idx > -1) {
            list.todos[idx] = payload.todo;
            this.emit('change');
        }
    },

    onRemoveTodo: function(payload) {
    },

    getState: function() {
        return {
            lists: this.lists
        };
    }
});
