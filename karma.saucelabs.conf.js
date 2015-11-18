/**
 *  Prerequistes:
 *
 *  1. Sauce Connect already running
 *  2. SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set
 */
module.exports = function(config) {

    require('./karma.conf')(config);

    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 8.1'
        },

        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        },

        sl_ie_9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9'
        },

        sl_ie_8: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '8'
        },

        sl_firefox_35: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 7'
        }
    };

    config.reporters.push('saucelabs');

    config.set({

        sauceLabs: {
            testName: 'react-mini-router client tests',
        },

        customLaunchers: customLaunchers,

        browsers: Object.keys(customLaunchers),

        singleRun: true
    });
};
