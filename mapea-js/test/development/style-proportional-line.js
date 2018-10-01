import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleProportional from 'M/style/Proportional';
import StyleLine from 'M/style/Line';

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
const styleline = new StyleLine({
  fill: {
    color: 'red',
  },
  stroke: {
    color: 'black',
    width: 3,
  },
});
const styleproportional = new StyleProportional('gid', 15, 30);
styleproportional.add(styleline);
wfs.setStyle(styleproportional);

window.mapjs = mapjs;
