import M from 'facade/js/Mapea';

window.map = M.map({
  layers: ['OSM'],
  projection: 'EPSG:3857*m',
  container: 'map',
  controls: ['mouse', 'layerswitcher', 'scale', 'scaleline', 'panzoom', 'panzoombar', 'overviewmap', 'location'],
});
