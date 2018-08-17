import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleLine from 'facade/js/style/Line';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const styleline = new StyleLine({
  fill: {
    color: 'red',
  },
  stroke: {
    color: 'black',
    width: 3,
  },
});

const wfs = new WFS({
  namespace: 'mapea',
  name: 'mapb_hs1_100',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers(wfs);
wfs.setStyle(styleline);

window.mapjs = mapjs;
