import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleProportional from 'M/style/Proportional';
import StylePolygon from 'M/style/Polygon';

const mapjs = map({
  container: 'map',
  controls: ['layerswitcher'],
});

const wfs = new WFS({
  namespace: 'mapea',
  name: 'da_provincia',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
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
const styleproportional = new StyleProportional('area', 15, 30);
styleproportional.add(Stylepolygon);
wfs.setStyle(styleproportional);

window.mapjs = mapjs;
