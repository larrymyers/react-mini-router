var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

module.exports = function triggerUrl(url, silent) {
    if (ExecutionEnvironment.canUseDOM) {
        window.history.pushState({}, '', url);

        if (!silent) window.dispatchEvent(new window.Event('popstate'));
    }
};
