import React from 'react';
import urllite from 'urllite/lib/core'
import detect from './detect'
import Router from './Router'


export function addRouting (Component, routes, options) {
    var router = new Router(routes, options);

    return class ReactComponent extends React.Component {

    }
}

