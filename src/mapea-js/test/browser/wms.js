import M from 'facade/js/Mapea';
import WMS from 'facade/js/layer/WMS';

const wms = new WMS({
  url: 'http://www.ideandalucia.es/wms/mta10v_2007?',
  name: 'Limites',
});
//
window.map = M.map({
  layers: ['OSM'],
  container: 'map',
  controls: ['mouse', 'layerswitcher', 'scale', 'scaleline', 'panzoom', 'panzoombar', 'overviewmap', 'location'],
});
map.addLayers(wms);
