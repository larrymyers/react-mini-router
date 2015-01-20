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

    addTodo: function(text) {
        this.dispatch(constants.ADD_TODO, { text: text });
    },

    updateTodo: function(todo) {
        this.dispatch(constants.UPDATE_TODO, { todo: todo });
    },

    removeTodo: function(todo) {
        this.dispatch(constants.REMOVE_TODO, { todo: todo });
    }
};
