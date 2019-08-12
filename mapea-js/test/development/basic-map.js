import { map } from 'M/mapea';

M.config.DEFAULT_PROJ = 'EPSG:23030*m';

window.map = map({
  container: 'map',
  wmcfile: ['http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/mapa.xml*mapa'],
  controls: ['overviewmap', 'scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
  zoom: 10,
});
