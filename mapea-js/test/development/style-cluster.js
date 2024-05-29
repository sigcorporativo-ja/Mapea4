import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleCluster from 'M/style/Cluster';

window.mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
  namespace: 'sepim',
  name: 'campamentos',
  legend: 'Campamentos',
  geometry: 'Point',
});

window.mapjs.addLayers([wfs]);

const stylecluster = new StyleCluster();

wfs.setStyle(stylecluster);
