import { map } from 'M/mapea';

window.mapjs = map({
  container: 'map',
  controls: ['overviewmap', 'scale', 'scaleline', 'rotate', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
  getfeatureinfo: 'plain',
});
