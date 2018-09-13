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
  namespace: 'mapea',
  name: 'da_provincia',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers(wfs);
wfs.setStyle(stylepolygon);

window.mapjs = mapjs;
