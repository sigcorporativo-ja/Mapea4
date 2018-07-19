import M from 'facade/js/Mapea';

const map = M.map({
  container: 'map',
  layers: ['OSM'],
});
map.getLayers();
