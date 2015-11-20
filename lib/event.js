var detect = require('./detect');

module.exports = {
    createEvent: function(name) {
        if (detect.hasEventConstructor()) {
            return new window.Event(name);
        } else {
            var event = document.createEvent('Event');
            event.initEvent(name, true, false);
            return event;
        }
    },

    listenOn: function (element, eventName, callback) {
        var removeEventListener;

        if (element && element.addEventListener) {
            element.addEventListener(eventName, callback, false);

            removeEventListener = function() {
                element.removeEventListener(eventName, callback, false);
            };
        } else if (element && element.attachEvent) {
            element.attachEvent('on' + eventName, callback);

            removeEventListener = function() {
                element.detachEvent('on' + eventName, callback);
            };
        } else {
            removeEventListener = function() {};
        }

        return removeEventListener;
    },

    getEventTarget: function(evt) {
        if (!evt) {
            evt = window.event; // IE
        }

        var target = evt.target || evt.srcElement || window;

        // Safari will fire events on text nodes of the actual element.
        if (target.nodeType === 3) {
            target = target.parentNode;
        }

        return target;
    }
};
