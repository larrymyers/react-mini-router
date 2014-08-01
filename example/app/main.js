var React = require('react'),
    Fluxxor = require('fluxxor'),
    TodoStore = require('./todo-store'),
    App = require('./components/app'),
    actions = require('./actions');

var stores = {
    'TodoStore': new TodoStore(window.APP_DATA || {})
};

var flux = new Fluxxor.Flux(stores, actions);

React.renderComponent(
    App({ flux: flux }),
    document.getElementById('app')
);