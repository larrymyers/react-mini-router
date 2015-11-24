/* global describe, it, beforeEach, afterEach, sinon */

var assert = require('assert'),
    url = require('url'),
    event = require('../../lib/event'),
    Router = require('../../lib/Router');

describe('Router', function() {
    var mockWindow;

    beforeEach(function() {
        mockWindow = document.createElement('div');
        mockWindow.location = url.parse(window.location.href);
        mockWindow.location.href = window.location.href;
        document.body.appendChild(mockWindow);
    });

    afterEach(function() {
        document.body.removeChild(mockWindow);
        mockWindow = null;
    });

    it('Should execute the provided onChangeCallback when the window url hash changes.', function() {
        var callbackSpy = sinon.spy();

        var router = new Router(['/foo'], callbackSpy, { window: mockWindow });
        router.startListening();

        mockWindow.location.hash = '/foo';
        mockWindow.dispatchEvent(event.createEvent('hashchange'));

        router.stopListening();

        assert.equal(callbackSpy.callCount, 1);
        assert.equal(callbackSpy.firstCall.args[0], '/foo');
    });

    it('Should execute the provided onChangeCallback when the window url path changes.', function() {
        var callbackSpy = sinon.spy();

        var router = new Router(['/foo'], callbackSpy, { window: mockWindow, useHistory: true });
        router.startListening();

        mockWindow.location.pathname = '/foo';
        mockWindow.location = url.parse(url.format(mockWindow.location));
        mockWindow.dispatchEvent(event.createEvent('popstate'));

        router.stopListening();

        assert.equal(callbackSpy.callCount, 1);
        assert.equal(callbackSpy.firstCall.args[0], '/foo');
    });

    it('Should not execute the onChangeCallback when not listening for history changes.', function() {
        var callbackSpy = sinon.spy();

        var router = new Router(['/foo'], callbackSpy, { window: mockWindow, useHistory: true });
        router.startListening();
        router.stopListening();

        mockWindow.location.pathname = '/foo';
        mockWindow.location = url.parse(url.format(mockWindow.location));
        mockWindow.dispatchEvent(event.createEvent('popstate'));

        assert.equal(callbackSpy.callCount, 0);
    });

    it('Should trap clicks on child anchor tags and route on matched urls.', function() {

    });

});
