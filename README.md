# React Mini Router

[![Build Status](https://travis-ci.org/larrymyers/react-mini-router.svg?branch=master)](https://travis-ci.org/larrymyers/react-mini-router)

A minimal URL router for [React.js](http://facebook.github.io/react/).

The router provides a small (both in size and complexity) mixin that is easy to integrate
into a root level component and makes little to no demands how you structure your application.

Routes call methods instead of creating components directly, so you can do async data loading outside of
the child components and keep them stateless. This also makes server side rendering straight forward.

Supports HTML5 History and Hash URLs, and requires no special components or markup. You can use
regular anchor tags in your html markup to trigger navigation, or use the [navigate](./lib/navigate.js)
util method to programmatically trigger routes. 

Its only dependencies are [path-to-regexp](https://github.com/component/path-to-regexp),
[urllite](https://github.com/hzdg/urllite.js) and React >= 0.10.0.

The complete browser build is 8.2kb minified and 3.1kb minified and gzipped.

## Install

If using CommonJS modules and browserify:

    npm install react-mini-router

For all other browser environments:

    bower install react-mini-router

## Usage

    var React = require('react'),
        RouterMixin = require('react-mini-router').RouterMixin;

    var App = React.createClass({

        mixins: [RouterMixin],

        routes: {
            '/': 'home',
            '/message/:text': 'message'
        },

        render: function() {
            return this.renderCurrentRoute();
        },

        home: function() {
            return <div>Hello World</div>;
        },

        message: function(text) {
            return <div>{text}</div>;
        },

        notFound: function(path) {
            return <div class="not-found">Page Not Found: {path}</div>;
        }

    });

    module.exports = App;

### Route Definitions and Handler Methods

The RouterMixin uses path-to-regexp for all route definitions. See the docs on [parameters](https://github.com/component/path-to-regexp#parameters)
for the variations allowed when defining urls.

When a url matches a route, the handler method is executed. The handler is called with the following arguments:

1. Each matched parameter, in the order it appears in the url.
2. An object of key/value pairs that represents the parsed url query string.

Example:

    routes: {
       '/search/:searchQuery': 'searchResults'
    }

    function searchResults(searchQuery, params) {
        // logic for getting search results data and rendering component
    }

    "/search/giant%20robots?sort=ascending&size=20" => searchResults("giant robots", { "sort": "ascending", "size": "20" })

See the [example](./example) app for a complete solution that includes server side rendering 
and integrates with [Fluxxor](https://github.com/BinaryMuse/fluxxor) for Store/Dispatch functionality.

## Alternatives

* [React Router](https://github.com/rackt/react-router)
* [React Router Component](https://github.com/andreypopp/react-router-component)


