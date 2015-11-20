/* global describe, it, beforeEach, sinon */

var assert = require('assert'),
    urllite = require('urllite'),
    event = require('../../lib/event'),
    Router = require('../../lib/Router');

describe('Router', function() {
    var mockWindow;

    beforeEach(function() {
        mockWindow = document.createElement('div');
        mockWindow.location = urllite(window.location.href);
        mockWindow.location.href = window.location.href;
    });

    it('Should execute the provided onChangeCallback when the window location changes.', function() {
        var callbackSpy = sinon.spy();

        var router = new Router(['/foo'], callbackSpy, { window: mockWindow });
        router.startListening();

        mockWindow.dispatchEvent(event.createEvent('hashchange'));

        assert.equal(callbackSpy.callCount, 1);
    });

});
