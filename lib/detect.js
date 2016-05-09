var canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

module.exports = {
    canUseDOM: canUseDOM,
    hasPushState: canUseDOM && window.history && 'pushState' in window.history,
    hasReplaceState: canUseDOM && window.history && 'replaceState' in window.history,
    hasHashbang: function() {
        return canUseDOM && window.location.hash.indexOf('#!') === 0;
    },
    hasEventConstructor: function() {
        return typeof window.Event == "function";
    }
};
