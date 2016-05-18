import videojs from 'video.js';

const MenuItem = videojs.getComponent('MenuItem');

class DotsubTrackItem extends MenuItem {

  constructor(player, options) {
    super(player, options);
  }

  handleClick() {
    super.handleClick();
    this.player_.trigger('trackselected', this.options_.track);
  }

}

videojs.registerComponent('DotsubTrackItem', DotsubTrackItem);

export default DotsubTrackItem;
