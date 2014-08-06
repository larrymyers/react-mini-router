var detect = require('./detect');

module.exports = function triggerUrl(url, silent) {
    if (detect.hasHashbang()) {
        window.location.hash = '#!' + url;
    } else if (detect.hasPushState) {
        window.history.pushState({}, '', url);
        if (!silent) window.dispatchEvent(new window.Event('popstate'));
    } else {
        console.error("Browser does not support pushState, and hash is missing a hashbang prefix!");
    }
};
