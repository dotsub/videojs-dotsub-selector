import videojs from 'video.js';
import axios from 'axios';
import './DotsubTrackButton.js';
import { TRACKS_SELECTED_EVENT, READY_EVENT,
  CAPTIONS_EVENT, LANGUAGE_EVENT, LOAD_EVENT } from './constants.js';

// Default options for the plugin.
const defaults = {
  loadFirstTrack: true
};

/**
 * Function that renders tracks onto the controlBar
 *
 * If options.loadFirstTrack is true the first track is seleted.
 *
 * @function renderTracks
 * @param    {Array} dotsubTracks
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const renderTracks = (dotsubTracks, player, options) => {
  let dotsubTrackButton = player.controlBar.addChild('DotsubTrackButton', {
    dotsubTracks
  });
  let volumeButton = document.getElementsByClassName('vjs-volume-menu-button')[0];

  player.controlBar.el().insertBefore(dotsubTrackButton.el(), volumeButton);

  if (options.loadFirstTrack && dotsubTracks.length > 0) {
    player.trigger(TRACKS_SELECTED_EVENT, dotsubTracks[0]);
  }
};

/**
 * Function that loads the tracks from Dotsub's API via xhr
 *
 * @function loadMediaTracks
 * @param    {String} mediaId
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const loadMediaTracks = (mediaId, player, options) =>
  axios.get(`/api/v3/media/${mediaId}/tracks`)
    .then(response => renderTracks(response.data, player, options));

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
    axios.get(`/api/v3/tracks/${track.trackId}`)
      .then(response => {
        if (track.language) {
          player.trigger(LANGUAGE_EVENT, track.language);
        }
        player.trigger(CAPTIONS_EVENT, response.data);
      });
  } else {
    player.trigger(CAPTIONS_EVENT, []);
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
  player.on(LOAD_EVENT, (event, mediaId) => loadMediaTracks(mediaId, player, options));
  // track selected is triggered by DotsubTrackItem to denote the selection of a track.
  player.on(TRACKS_SELECTED_EVENT, (event, track) => selectTrack(track, player));

  // tell any listeners the selector plugin is ready
  player.trigger(READY_EVENT);
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
