var request = require('superagent');

var host = typeof window === 'undefined' ? 'http://localhost:4000' : '';

module.exports = {

    createTodo: function(data, callback) {
        request.post(host + '/api/todos').send(data).end(function(res) {
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