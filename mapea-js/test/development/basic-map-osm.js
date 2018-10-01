import { map } from 'M/mapea';

window.map = map({
  container: 'map',
  layers: ['OSM'],
  projection: 'EPSG:3857*m',
  controls: ['overviewmap', 'scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
});
