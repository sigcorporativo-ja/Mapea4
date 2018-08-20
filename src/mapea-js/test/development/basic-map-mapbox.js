import { map } from 'facade/js/mapea';

window.map = map({
  container: 'map',
  layers: ['MAPBOX*mapbox.pirates'],
  projection: 'EPSG:3857*m',
  controls: ['overviewmap', 'scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
});
