import videojs, { xhr }  from 'video.js';
import './DotsubTrackButton.js';

// Default options for the plugin.
const defaults = {};

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

    this.on('loadtracks', (event, mediaId) => {
      // TODO: Move this out? Should the plugin do xhr requests?
      xhr(`/api/v3/media/${mediaId}/tracks`, (error, response, responseBody) => {
        const dotsubTracks = JSON.parse(responseBody);

        // insert button
        let dotsubTrackButton = this.controlBar.addChild('DotsubTrackButton', { dotsubTracks });
        let volumeMenuButton = document.getElementsByClassName('vjs-volume-menu-button')[0];

        this.controlBar.el().insertBefore(dotsubTrackButton.el(), volumeMenuButton);

      })
    });

    this.on('trackselected', (event, track) => {

      if (track) {
        xhr(`/api/v3/tracks/${track.trackId}`, (error, response, responseBody) => {
          if (response.statusCode === 200) {
            const captions = JSON.parse(responseBody);
            this.trigger('captions', captions);
          } else {
            this.trigger('captions', []);
          }
        });
      } else {
        this.trigger('captions', []);
      }
    });

    this.trigger('selectorready');
  });
};

// Register the plugin with video.js.
videojs.plugin('dotsubSelector', dotsubSelector);

// Include the version number.
dotsubSelector.VERSION = '__VERSION__';

export default dotsubSelector;
