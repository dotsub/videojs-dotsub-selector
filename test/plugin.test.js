import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';
import plugin from '../src/plugin';
import DotsubTrackButton from '../src/DotsubTrackButton.js';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-dotsub-selector', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.expect(2);

  assert.strictEqual(
    Player.prototype.dotsubSelector,
    plugin,
    'videojs-dotsub-selector plugin was registered'
  );

  this.player.dotsubSelector();

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(
    this.player.hasClass('vjs-dotsub-selector'),
    'the plugin adds a class to the player'
  );
});

QUnit.test('plugin throws selectorready event', function(assert) {
  assert.expect(1);

  const stub = sinon.stub(this.player, 'trigger');

  this.player.dotsubSelector();

  // Tick the clock forward enough to trigger the player to be "captionsready".
  this.clock.tick(5);

  assert.ok(
    stub.calledWith('selectorready'),
    'the plugin throws a ready event'
  );

  stub.restore();
});

QUnit.test('TrackButton creates items', function(assert) {
  assert.expect(2);

  const trackButton = new DotsubTrackButton(this.player, {
    dotsubTracks: []
  });

  assert.equal(1,
    trackButton.items.length,
    'track button not created, should have one item'
  );

  const trackButtonWithItems = new DotsubTrackButton(this.player, {
    dotsubTracks: [{ name: 'test', language: {
      name: 'Foo'
    }}]
  });

  assert.equal(2,
    trackButtonWithItems.items.length,
    'track button not created, should have two items'
  );
});
