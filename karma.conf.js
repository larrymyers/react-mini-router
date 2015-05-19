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

        frameworks: ['mocha', 'browserify'],

        browserify: {
            debug: true
        },

        preprocessors: {
            'test/client/**/*.test.js': ['browserify']
        },

        reporters: ['progress'],

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
