import videojs from 'video.js';
import DotsubTrackItem from './DotsubTrackItem.js';

const MenuButton = videojs.getComponent('MenuButton');

class DotsubTrackButton extends MenuButton {

  constructor(player, options) {
    super(player, options);

    player.on('trackselected', (event, track) => {
      const div = this.player_.el()
              .getElementsByClassName('vjs-dotsub-selector-language')[0];

      if (track) {
        div.innerHTML = `${track.language.name} - ${track.name}`;
      } else {
        div.innerHTML = 'Captions Off';
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

    span.classList.add('vjs-dotsub-selector-language');
    span.innerHTML = 'Captions Off';
    el.appendChild(span);

    return el;
  }

  createItems(items = []) {

    items.push(new DotsubTrackItem(this.player_, {label: 'Captions Off'}));

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
