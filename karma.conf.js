var webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({

        basePath: '',

        files: [
            'test/vendor/es5-shim.js',
            'test/vendor/jquery-2.1.1.js',
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
