import { map } from 'facade/js/mapea';

window.map = map({
  container: 'map',
  layers: ['OSM'],
  projection: 'EPSG:3857*m',
});
