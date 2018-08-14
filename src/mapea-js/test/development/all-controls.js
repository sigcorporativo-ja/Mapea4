import { map } from 'facade/js/mapea';

window.mapjs = map({
  container: 'map',
  controls: ['overviewmap', 'scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
  getfeatureinfo: 'plain',
});
