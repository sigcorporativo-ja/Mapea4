import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleProportional from 'M/style/Proportional';
import StylePolygon from 'M/style/Polygon';

const mapjs = map({
  container: 'map',
  controls: ['layerswitcher'],
});

const wfs = new WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Provincias",
  geometry: 'MPOLYGON'
});

mapjs.addLayers([wfs]);
const Stylepolygon = new StylePolygon({
  fill: {
    color: 'red',
  },
  stroke: {
    color: 'white',
    stroke: 4,
  },
});
const styleproportional = new StyleProportional('u_cod_prov', 15, 30);
styleproportional.add(Stylepolygon);
wfs.setStyle(styleproportional);

window.mapjs = mapjs;
