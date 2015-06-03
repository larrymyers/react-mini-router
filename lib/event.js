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
    }
};
