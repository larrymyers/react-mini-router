var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    React = require('react'),
    plates = require('plates'),
    _find = require('lodash-node/modern/collections/find'),
    _remove = require('lodash-node/modern/arrays/remove'),
    _extend = require('lodash-node/modern/objects/assign'),
    Fluxxor = require('fluxxor'),
    TodoStore = require('./app/todo-store'),
    actions = require('./app/actions'),
    App = React.createFactory(require('./app/components/app'));

var app = express(),
    todos = [];

app.use(bodyParser.json());

// PAGES

app.get('/', function(req, res) {
    var stores = {
        'TodoStore': new TodoStore({ todos: todos })
    };

    var flux = new Fluxxor.Flux(stores, actions);
    var appHtml = React.renderToString(App({ path: '/', flux: flux }));

    render(res, appHtml, { todos: todos, history: req.query.mode !== 'hash' });
});

app.get('/todos/new', function(req, res) {
    var stores = {
        'TodoStore': new TodoStore({ todos: todos })
    };

    var flux = new Fluxxor.Flux(stores, actions);
    var appHtml = React.renderToString(App({ path: '/todos/new', flux: flux }));

    render(res, appHtml, { todos: todos, history: req.query.mode !== 'hash' });
});

// API ENDPOINTS

app.post('/api/todos', function createTodo(req, res) {
    var todo = req.body;

    todo.id = todos.length + 1;
    todos.push(todo);

    res.status(201).send(todo);
});

app.put('/api/todos/:todoId', function updateTodo(req, res) {
    var todoId = parseInt(req.params.id),
        props = req.body,
        todo = _find(todos, function(todo) { return todo.id === todoId; });

    _extend(todo, props);

    res.send(todo);
});

app.delete('/api/todos/:todoId', function deleteTodo(req, res) {
    var todoId = parseInt(req.params.id),
        removed = _remove(todos, function(todo) { return todo.id === todoId; });

    res.send(removed);
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(4000);

function render(res, appHtml, appData) {
    fs.readFile(
        path.join(__dirname, 'public', 'index.html'),
        { encoding: 'utf-8'},
        function(err, tmpl) {
            var html = plates.bind(tmpl, {
                app: appHtml,
                appData: 'APP_DATA = ' + JSON.stringify(appData)
            });

            res.set('Content-Type', 'text/html');
            res.send(html);
        }
    );
}

