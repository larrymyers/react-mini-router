**This Project is Looking for Active Maintainers** 
[See Issue #68 to Volunteer](https://github.com/larrymyers/react-mini-router/issues/68)

# React Mini Router

[![Build Status](https://travis-ci.org/larrymyers/react-mini-router.svg?branch=master)](https://travis-ci.org/larrymyers/react-mini-router)

A minimal URL router for [React.js](http://facebook.github.io/react/).

The router provides a small React.js mixin that is easy to integrate into a root level component.
It makes little to no demands on how you structure your application.

Routes call methods instead of creating components directly.  This makes async data loading outside of
the child components straight forward (allowing them to remain stateless). This also makes server
side rendering straight forward.

The Router supports the  HTML5 History API and Hash URLs. It requires no special components or markup.
You can use regular anchor tags in your html markup to trigger navigation, or use the [navigate](./lib/navigate.js)
util method to programmatically trigger routes. 

Its only dependencies are [path-to-regexp](https://github.com/component/path-to-regexp),
[urllite](https://github.com/hzdg/urllite.js) and React >= 0.14.0.

The complete browser build is 10kb minified and 4kb minified and gzipped.

See the [example](./example) app for a complete solution that includes server side rendering
and integrates with [Fluxxor](https://github.com/BinaryMuse/fluxxor) for Store/Dispatch functionality.

**IMPORTANT** If you require React 0.13 or earlier, please install version 1.1.7. Version 2.0.0 
requires React 0.14 or newer.

## Install

If using CommonJS modules and browserify:

    npm install react-mini-router

For all other browser environments:

    bower install react-mini-router

The [dist/react-mini-router.js](./dist/react-mini-router.js) build exposes a global ReactMiniRouter variable.

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

### Configuration

By default the RouterMixin will use hash urls for routes. To enable the HTML5 History API
with pushState pass a "history" boolean property to the Component. If you're using server rendering
and intend on focusing primarily on modern browsers it is recommended to enable the History API.

If a browser doesn't support the History API it will automatically fall back to hash urls.

**NOTE:**  Hash urls will use the hashbang (i.e. #!) format in order to properly support
the [ajax crawling](https://developers.google.com/webmasters/ajax-crawling/) Google spec.

Example:

    React.render(
        App({ history: true }),
        document.getElementById('app')
    );

You can also mount the Router at a root path, and all routes will be matched relative to it:

    React.render(
        App({ root: '/some/path/to/app' }),
        document.getElementById('app')
    );

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

### The 404 Not Found Route

By default the RouterMixin will throw an Error if it can't match a route. To render a 404 Not Found
page just define a 'notFound' method on the component. It takes a single argument, path, which is
the url path that failed to match a route definition. Any unmatched route will call this route handler
if it is defined. See the usage example above for a code example.

### Navigation

Any child anchor elements will have their click events captured, and if their href matches a route
the matched route handler will be called.

To programmatically trigger navigation there is a provided navigate method:

    var navigate = require('react-mini-router').navigate;

    navigate('/foo');

If you want to update the address bar url, but not trigger routing:

    navigate('/foo', true);

## Server Rendering

See the [example](./example) app for how to approach server rendering. The short answer
is that for every url the server must render you should provide the necessary data
to the root Component as props, including the `path` property.

[React.renderToString](http://facebook.github.io/react/docs/top-level-api.html#react.rendertostring)
does not trigger the Component lifecycle methods, so you must do all async data loading outside
of the render process.

## Nested Routers

Nested routers are supported, though it requires some manual work. The `root` property must
be explicitly passed to the nested router, which sets the base url where it will be mounted.

You also need to provide a wildcard param at the end of any routes that will call route handlers
that contain a nested router. The [example](./example) app and tests show how to do this.

## Running the Example App

The [example](./example) app demonstrates how to use react-mini-router for client and server
side rendering. To run the app do the following:

    cd example
    npm install
    gulp serve
    
Then open a new browser window to:

    http://localhost:4000

## Alternatives

* [React Router](https://github.com/rackt/react-router)
* [React Router Component](https://github.com/andreypopp/react-router-component)
