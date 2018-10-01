import { map } from 'M/mapea';

window.map = map({
  container: 'map',
  controls: ['overviewmap', 'scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
});
