import videojs from 'video.js';
import { TRACKS_SELECTED_EVENT } from './constants.js';

const MenuItem = videojs.getComponent('MenuItem');

class DotsubTrackItem extends MenuItem {

  constructor(player, options) {
    super(player, options);
  }

  handleClick() {
    super.handleClick();
    this.player_.trigger(TRACKS_SELECTED_EVENT, this.options_.track);
  }

}

videojs.registerComponent('DotsubTrackItem', DotsubTrackItem);

export default DotsubTrackItem;
