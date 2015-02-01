var request = require('superagent');

var host = typeof window === 'undefined' ? 'http://localhost:4000' : '';

module.exports = {

    createList: function(data, callback) {
        request.post(host + '/api/lists/').send(data).end(function(res) {
            callback(null, res.body);
        });
    },

    deleteList: function(data, callback) {

    },

    createTodo: function(list, data, callback) {
        request.post(host + '/api/lists/' + list.id + '/todos/').send(data).end(function(res) {
            callback(null, res.body);
        });
    },

    updateTodo: function(todoId, data, callback) {
        request.put(host + '/api/todos/' + todoId).end(function(res) {
            callback(null, res.body);
        });
    },

    removeTodo: function(todoId, callback) {
        request.del(host + '/api/todos/' + todoId).end(function(res) {
            callback(null, res.body);
        });
    }

};
