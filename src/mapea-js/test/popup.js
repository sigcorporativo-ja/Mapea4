import { map } from 'facade/js/mapea';
import Popup from 'facade/js/Popup';
import OLPopup from 'ol-popup';

window.p = new OLPopup();

window.mapjs = map({
  container: 'map',
  controls: ['mouse'],
});


const popup = new Popup();
popup.addTab({
  title: 'Hello',
  content: 'World',
});
popup.addTab({
  title: 'Hola',
  content: 'Mundo',
});

window.mapjs.addPopup(popup, [359250, 4130000]);
