import { map } from 'facade/js/mapea';
import Popup from 'facade/js/Popup';
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
