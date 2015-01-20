var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    RouterMixin = require('./../../../lib/RouterMixin'),
    CreateTodoList = require('./createtodolist'),
    TodoList = require('./todolist');

var App = React.createClass({

    routes: {
        '/': 'viewAllLists',
        '/lists/:id': 'viewList'
    },

    mixins: [RouterMixin, FluxMixin, StoreWatchMixin('TodoStore')],

    getStateFromFlux: function() {
        return this.getFlux().store('TodoStore').getState();
    },

    render: function() {
        return <div>{this.renderCurrentRoute()}</div>;
    },

    viewAllLists: function() {
        return (
            <div>
                <ul className="lists list-group">
                {this.state.lists.map(function(list) {
                    return <li className="list-group-item" key={list.id}>{list.name}</li>;
                })}
                </ul>
                <CreateTodoList/>
            </div>
        );
    },

    viewList: function(id) {
        return null;
    },

    notFound: function(path) {
        return <div class="not-found">Uh oh. {path} doesn't exist.</div>;
    }

});

module.exports = App;
