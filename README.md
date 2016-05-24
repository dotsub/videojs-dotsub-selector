[![Build Status](https://travis-ci.org/dotsub/videojs-dotsub-selector.svg?branch=master)](https://travis-ci.org/dotsub/videojs-dotsub-selector)[![npm version](https://badge.fury.io/js/videojs-dotsub-selector.svg)](https://badge.fury.io/js/videojs-dotsub-selector)

# videojs-dotsub-selector

Adds a track selector to the menubar. This is used in conjunction with [videojs-dotsub-captions](https://github.com/dotsub/videojs-dotsub-captions). This provides a selection menu within the player for which captions to display. The plugin uses Dotsub's API to fetch and list the langauges for a video.

### Events

*selectorready*: This event denotes the plugin is loaded and ready to fetch captions.

*loadtracks*: This event tells the plugin to load captions from Dotsub. This expects a video ID as the event data. (ex: `player.trigger('loadtracks', 'trackId');`)

*trackselected*: This event is triggered when the user has selected a track from the list in the control bar. The event data payload contains a track object. If no track object is present 'Captions Off' was selected. 

## Installation

```sh
npm install --save videojs-dotsub-selector
```

## Usage

To include videojs-dotsub-selector on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-dotsub-selector.min.js"></script>
<script>
  var player = videojs('my-video');

  player.dotsubSelector();
</script>
```

### Browserify

When using with Browserify, install videojs-dotsub-selector via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-dotsub-selector');

var player = videojs('my-video');

player.dotsubSelector();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-dotsub-selector'], function(videojs) {
  var player = videojs('my-video');

  player.dotsubSelector();
});
```

## License

Apache-2.0. Copyright (c) Brooks Lyrette &lt;brooks@dotsub.com&gt;


[videojs]: http://videojs.com/
