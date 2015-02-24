module.exports = function(config) {
    config.set({

        basePath: '',

        files: [
            'test/vendor/es5-shim.js',
            'test/vendor/jquery-2.1.1.js',
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
