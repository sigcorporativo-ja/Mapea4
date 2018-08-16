import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleProportional from 'facade/js/style/Proportional';
import StylePoint from 'facade/js/style/Point';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  namespace: 'mapea',
  name: 'mapb_hs1_100',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers([wfs]);
const stylepoint = new StylePoint({
  fill: {
    color: 'red',
  },
  stroke: {
    color: 'white',
    stroke: 4,
  },
});
const styleproportional = new StyleProportional('gid', 15, 30);
styleproportional.add(stylepoint);
wfs.setStyle(styleproportional);

window.mapjs = mapjs;
