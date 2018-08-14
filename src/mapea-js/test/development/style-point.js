import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';

window.mapjs = map({
  container: 'map',
});

const wfs = new WFS({
  namespace: 'ggis',
  name: 'Colegios',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers([wfs, kml]);
