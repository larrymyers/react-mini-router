var webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({

        basePath: '',

        files: [
            'node_modules/console-polyfill/index.js',
            'test/vendor/es5-shim.js',
            'test/vendor/es5-sham.js',
            'test/vendor/jquery-1.11.3.js',
            'test/client/**/*.test.js'
        ],

        frameworks: ['mocha'],

        preprocessors: {
            'test/client/**/*.test.js': ['webpack']
        },

        reporters: ['progress'],

        webpack: {
            debug: true,
            devtool: 'eval'
        },

        webpackMiddleware: {
            stats: false
        },

        autoWatch: true,
        browsers: ['PhantomJS']
    });
};
