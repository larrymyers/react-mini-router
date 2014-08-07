var assert = require('assert');

describe('detect', function() {

    var detect = require('./../lib/detect');

    it('Should detect if it is running in a DOM environment.', function() {
        assert.ok(detect.canUseDOM);
    });

    it('Should detect if HTML5 History API is available.', function() {
        assert.ok(detect.hasPushState);
    });

    it('Should detect if it is in hashbang url mode.', function() {
        window.location.hash = '#!/foo';

        assert.ok(detect.hasHashbang());

        window.location.hash = '';

        assert.ok(!detect.hasHashbang());
    });

});
