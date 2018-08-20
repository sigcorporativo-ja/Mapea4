import { map } from 'facade/js/mapea';

window.map = map({
  container: 'map',
  controls: ['overviewmap', 'scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
});
