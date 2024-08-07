import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';

const mapjs = map({
  container: 'map',
  center: [343294, 4113510],
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wfs?',
  name: 'tematicos:Provincias',
});

mapjs.addLayers([wfs]);

window.mapjs = mapjs;
