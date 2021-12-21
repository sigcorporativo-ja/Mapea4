import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StylePolygon from 'M/style/Polygon';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const stylepolygon = new StylePolygon({
  fill: {
    color: 'yellow',
  },
  stroke: {
    color: 'black',
    width: 3,
  },
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
});

mapjs.addLayers(wfs);
wfs.setStyle(stylepolygon);

window.mapjs = mapjs;
