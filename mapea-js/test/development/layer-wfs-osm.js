import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';

const mapjs = map({
  container: 'map',
  layers: ['OSM'],
  projection: 'EPSG:3857*m',
  controls: ['layerswitcher'],
  center: [-349550, 4617450],
  zoom: 3,
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wfs?',
  name: 'tematicos:Provincias',
});

mapjs.addLayers([wfs]);
window.mapjs = mapjs;
