import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleProportional from 'M/style/Proportional';
import StylePoint from 'M/style/Point';

const mapjs = map({
  container: 'map',
  controls: ['layerswitcher'],
});

const wfs = new WFS({
  namespace: 'ggis',
  name: 'Colegios',
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
const styleproportional = new StyleProportional('Prueba', 15, 30);
styleproportional.add(stylepoint);
wfs.setStyle(styleproportional);

window.mapjs = mapjs;
