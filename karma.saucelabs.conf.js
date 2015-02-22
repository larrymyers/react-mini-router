module.exports = function(config) {

    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 7',
            version: '40'
        },

        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '11'
        },

        sl_ie_9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9'
        },

        sl_firefox_35: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 7',
            version: '35'
        }
    };

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

        reporters: ['progress', 'saucelabs'],

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        sauceLabs: {
            testName: 'react-mini-router client tests',
            startConnect: false
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        singleRun: true
    });
};
