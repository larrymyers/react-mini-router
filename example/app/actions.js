var constants = require('./constants'),
    todoService = require('./todo-service');

module.exports = {
    createList: function(name) {
        var self = this;
        todoService.createList({ name: name }, function(err, createdList) {
            self.dispatch(constants.ADD_LIST, createdList);
        });
    },

    deleteList: function(id) {
        this.dispatch(constants.DELETE_LIST, { id: id });
    },

    addTodo: function(list, text) {
        var self = this;
        todoService.createTodo(list, { text: text }, function(err, todo) {
            self.dispatch(constants.ADD_TODO, { listId: list.id, todo: todo });
        });
    },

    updateTodo: function(list, todo) {
        this.dispatch(constants.UPDATE_TODO, { listId: list.id, todo: todo });
    },

    removeTodo: function(todo) {
        this.dispatch(constants.REMOVE_TODO, { todo: todo });
    }
};
