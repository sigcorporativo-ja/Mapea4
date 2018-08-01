import M from 'facade/js/Mapea';
import KML from 'facade/js/layer/KML';
import proj4 from 'proj4';
window.map = M.map({
  layers: ['OSM'],
  // projection: 'EPSG:3857*m',
  container: 'map',
  controls: ['mouse', 'layerswitcher', 'scale', 'scaleline', 'panzoom', 'panzoombar', 'overviewmap', 'location'],
});

const kml = new KML({
  url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
});

map.addLayers(kml);
window.kml = kml;
window.proj4 = proj4;
