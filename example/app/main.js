var React = require('react'),
    Fluxxor = require('fluxxor'),
    TodoStore = require('./todo-store'),
    App = require('./components/app'),
    actions = require('./actions');

var data = window.APP_DATA || {},
    useHistory = data.history;

delete data.history;

var stores = {
    'TodoStore': new TodoStore(data)
};

var flux = new Fluxxor.Flux(stores, actions);

React.renderComponent(
    App({ flux: flux, history: useHistory }),
    document.getElementById('app')
);