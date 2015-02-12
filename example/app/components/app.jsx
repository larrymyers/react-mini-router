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
        '/lists/:id/:nested*': 'viewList'
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
                    return (
	                    <li className="list-group-item" key={list.id}>
                            <a href={'/lists/' + list.id + '/'}>{list.name}</a>
                        </li>
                    );
                })}
                </ul>
                <CreateTodoList/>
            </div>
        );
    },

    viewList: function(id) {
	    var list = this.state.lists.reduce(function(found, list) {
		    if (list.id == id) { return list; }
		    return found;
	    });

        return <TodoList list={list} root={'/lists/' + id}/>;
    },

    notFound: function(path) {
        return <div className="not-found">Uh oh. {path} doesn't exist.</div>;
    }

});

module.exports = App;
