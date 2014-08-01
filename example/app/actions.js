var constants = require('./constants');

module.exports = {
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
