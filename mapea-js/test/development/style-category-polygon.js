import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleCategory from 'M/style/Category';
import StylePolygon from 'M/style/Polygon';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
});

mapjs.addLayers([wfs]);
const stylecategory = new StyleCategory('nombre', {
  Almería: new StylePolygon({
    fill: { color: 'red' },
  }),
  Córdoba: new StylePolygon({
    stroke: { color: 'blue', width: 5 },
  }),
  other: new StylePolygon({
    stroke: { color: 'white', width: 3 },
    fill: { color: 'black' },
  }),
});
wfs.setStyle(stylecategory);

window.mapjs = mapjs;
