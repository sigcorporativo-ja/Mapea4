import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleCluster from 'M/style/Cluster';

window.mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  namespace: 'ggis',
  name: 'Colegios',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers([wfs]);

const stylecluster = new StyleCluster();

wfs.setStyle(stylecluster);
