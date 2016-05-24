import videojs from 'video.js';
import DotsubTrackItem from './DotsubTrackItem.js';

const MenuButton = videojs.getComponent('MenuButton');
const CAPTIONS_OFF = 'Captions Off';
const PLUGIN_CLASSNAME = 'vjs-dotsub-selector-language';

class DotsubTrackButton extends MenuButton {

  constructor(player, options) {
    super(player, options);

    player.on('trackselected', (event, track) => {
      const div = this.player_.el()
              .getElementsByClassName(PLUGIN_CLASSNAME)[0];

      if (track) {
        div.innerHTML = `${track.language.name} - ${track.name}`;
      } else {
        div.innerHTML = CAPTIONS_OFF;
      }
    });
  }

  buildCSSClass() {
    return `vjs-dotsub-selector-button vjs-menu-button ${super.buildCSSClass()}`;
  }

  createEl() {
    const el = super.createEl('div', {
      className: this.buildCSSClass()
    });
    const span = document.createElement('span');

    span.classList.add(PLUGIN_CLASSNAME);
    span.innerHTML = CAPTIONS_OFF;
    el.appendChild(span);

    return el;
  }

  createItems(items = []) {

    items.push(new DotsubTrackItem(this.player_, {label: CAPTIONS_OFF}));

    for (const track of this.options_.dotsubTracks) {
      items.push(new DotsubTrackItem(this.player_, {
        label: `${track.language.name} - ${track.name}`,
        track
      }));
    }

    return items;
  }

}

videojs.registerComponent('DotsubTrackButton', DotsubTrackButton);

export default DotsubTrackButton;
