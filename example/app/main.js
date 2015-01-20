var React = require('react'),
    Fluxxor = require('fluxxor'),
    TodoStore = require('./todo-store'),
    App = React.createFactory(require('./components/app'));

var data = window.APP_DATA || {},
    useHistory = data.history;

delete data.history;

var flux = new Fluxxor.Flux({
    'TodoStore': new TodoStore(data)
}, require('./actions'));

React.render(
    App({ flux: flux, history: useHistory }),
    document.getElementById('app')
);
