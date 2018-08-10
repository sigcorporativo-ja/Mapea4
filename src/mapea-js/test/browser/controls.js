import { map } from 'facade/js/mapea';
import * as Remote from 'facade/js/util/Remote';
window.map = map({
  layers: ['OSM'],
  // projection: 'EPSG:3857*m',
  container: 'map',
  controls: ['layerswitcher'],
});
