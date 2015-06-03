var detect = require('./detect');
var event = require('./event');

module.exports = function triggerUrl(url, silent) {
    if (detect.hasHashbang()) {
        window.location.hash = '#!' + url;
    } else if (detect.hasPushState) {
        window.history.pushState({}, '', url);
        if (!silent) {
            window.dispatchEvent(event.createEvent('popstate'));
        }
    } else {
        console.error("Browser does not support pushState, and hash is missing a hashbang prefix!");
    }
};
