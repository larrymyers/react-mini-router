var React = require('react'),
    _map = require('lodash-node/modern/collections/map');

var TodoList = React.createClass({

    render: function () {
        return (
            <ul>
            {_map(this.props.todos, function(todo) {
                return <li key={todo.id}>{todo.text}</li>;
            })}
            </ul>
        );
    }

});

module.exports = TodoList;
