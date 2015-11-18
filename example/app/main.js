var React = require('react'),
    ReactDOM = require('react-dom'),
    Fluxxor = require('fluxxor'),
    TodoStore = require('./todo-store'),
    App = React.createFactory(require('./components/app'));

var data = window.APP_DATA || {},
    useHistory = data.history;

delete data.history;

var flux = new Fluxxor.Flux({
    'TodoStore': new TodoStore(data)
}, require('./actions'));

ReactDOM.render(
    App({ flux: flux, history: useHistory }),
    document.getElementById('app')
);
