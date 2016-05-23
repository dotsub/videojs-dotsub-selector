import videojs, { xhr } from 'video.js';
import './DotsubTrackButton.js';

// Default options for the plugin.
const defaults = {
  loadFirstTrack: true
};

/**
 * Function that loads the tracks from Dotsub's API via xhr
 *
 * @function loadMediaTracks
 * @param    {String} mediaId
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const loadMediaTracks = (mediaId, player, options) => {
  xhr(`/api/v3/media/${mediaId}/tracks`, (error, response, responseBody) => {
    if (!error) {
      const dotsubTracks = JSON.parse(responseBody);
      renderTracks(dotsubTracks, player, options);
    }
  });
};

/**
 * Function that renders tracks onto the controlBar
 *
 * If options.loadFirstTrack is true the first track is seleted.
 *
 * @function renderTracks
 * @param    {Array} tracks
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const renderTracks = (tracks, player, options) => {
  let dotsubTrackButton = player.controlBar.addChild('DotsubTrackButton', {
    tracks
  });
  let volumeButton = document.getElementsByClassName('vjs-volume-menu-button')[0];

  player.controlBar.el().insertBefore(dotsubTrackButton.el(), volumeButton);

  if (options.loadFirstTrack && tracks.length > 0) {
    player.trigger('trackselected', tracks[0]);
  }
};

/**
 * Handles the selection of a track. The captions are loaded over xhr
 * then a 'captions' event is thrown. See videojs-dotsub-captions for how
 * captions are rendered.
 *
 * @function selectTrack
 * @param    {Object} track
 * @param    {Player} player
 */
const selectTrack = (track, player) => {
  if (track) {
    xhr(`/api/v3/tracks/${track.trackId}`, (error, response, responseBody) => {
      if (error || response.statusCode !== 200) {
        player.trigger('captions', []);
      } else {
        const captions = JSON.parse(responseBody);

        player.trigger('captions', captions);
      }
    });
  } else {
    player.trigger('captions', []);
  }
};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-dotsub-selector');

  // load tracks is an event that triggers an xhr request to get the track listing
  player.on('loadtracks', (event, mediaId) => loadMediaTracks(mediaId, player, options));
  // track selected is triggered by DotsubTrackItem to denote the selection of a track.
  player.on('trackselected', (event, track) => selectTrack(track, player));

  // tell any listeners the selector plugin is ready
  player.trigger('selectorready');
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function dotsubSelector
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const dotsubSelector = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('dotsubSelector', dotsubSelector);

// Include the version number.
dotsubSelector.VERSION = '__VERSION__';

export default dotsubSelector;
