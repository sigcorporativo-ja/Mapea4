import M from 'facade/js/Mapea';
import SearchStreet from 'plugins/searchstreet/facade/js/searchstreet';

const map = M.map({
  container: 'map',
  layers: ['OSM'],
  projection: 'EPSG:4326*d',
  // controls: ['scale', 'layerswitcher', 'scaleline', 'panzoombar', 'panzoom', 'mouse', 'overviewmap', 'location'],
});

window.map = map;
