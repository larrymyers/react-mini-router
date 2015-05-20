var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    React = require('react'),
    plates = require('plates'),
    _find = require('lodash/collection/find'),
    _remove = require('lodash/array/remove'),
    _cloneDeep = require('lodash/lang/cloneDeep'),
    _extend = require('lodash/object/assign'),
    _defaults = require('lodash/object/defaults'),
    Fluxxor = require('fluxxor'),
    TodoStore = require('./app/todo-store'),
    actions = require('./app/actions'),
    App = React.createFactory(require('./app/components/app'));

var app = express(),
    todoLists = [];

try {
    todoLists = JSON.parse(fs.readFileSync('db.json', 'utf8'));
} catch(e) {
    // no saved data yet, just continue
}

function saveDB(callback) {
    fs.writeFile('db.json', JSON.stringify(todoLists, null, 4), 'utf8', callback);
}

if (process.env.NODE_ENV !== 'production') {
    var webpackDevMiddleware = require('webpack-dev-middleware'),
        webpack = require('webpack'),
        webpackConfig = _cloneDeep(require('./webpack.config'));

    webpackConfig.debug = true;
    webpackConfig.devtool = 'eval';

    app.use(webpackDevMiddleware(webpack(webpackConfig), { stats: false }));
}

app.use(bodyParser.json());

// PAGES

app.get('/', renderApp);
app.get('/lists*', renderApp);

function renderApp(req, res) {
    var stores = {
        'TodoStore': new TodoStore({ lists: todoLists })
    };

    var flux = new Fluxxor.Flux(stores, require('./app/actions'));
    var appHtml = React.renderToString(App({ path: req.path, flux: flux }));

    fs.readFile(
        path.join(__dirname, 'public', 'index.html'),
        { encoding: 'utf-8'},
        function(err, tmpl) {
            var html = plates.bind(tmpl, {
                app: appHtml,
                appData: 'APP_DATA=' + JSON.stringify({ lists: todoLists, history: req.query.mode !== 'hash' })
            });

            res.set('Content-Type', 'text/html');
            res.send(html);
        }
    );
}

// API ENDPOINTS

app.post('/api/lists/', function createList(req, res) {
    var list = req.body;
    list.id = todoLists.length + 1;
    _defaults(list, { name: 'New List', todos: [] });
    todoLists.push(list);

    saveDB(function() {
        res.status(201).send(list);
    });
});

app.delete('/api/lists/:listId', function deleteList(req, res) {
    var listId = req.params.listId,
        removedList = _remove(todoLists, { id: listId });

    saveDB(function() {
        res.send(removedList);
    });
});

app.post('/api/lists/:listId/todos/', function createTodo(req, res) {
    var list = _find(todoLists, { id: parseInt(req.params.listId) }),
        todo = req.body;

    todo.id = list.todos.length + 1;
    list.todos.push(todo);

    saveDB(function() {
        res.send(todo);
    });
});

app.put('/api/lists/:listName/todos/:todoId', function updateTodo(req, res) {
    var list = _find(todoLists, { id: req.params.listId }),
        todoId = parseInt(req.params.id),
        props = req.body,
        todo = _find(list.todos, { id: todoId });

    _extend(todo, props);

    saveDB(function() {
        res.send(todo);
    });
});

app.delete('/api/lists/:listName/todos/:todoId', function deleteTodo(req, res) {
    var list = _find(todoLists, { id: req.params.listId }),
        todoId = parseInt(req.params.id),
        removed = _remove(list.todos, { id: todoId });

    saveDB(function() {
        res.send(removed);
    });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(4000);
