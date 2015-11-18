var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        main: path.resolve('./app/main.js')
    },
    output: {
        path: path.resolve('./public'),
        filename: 'js/app.js'
    },
    resolve: {
        root: ["node_modules"]
    }
};
