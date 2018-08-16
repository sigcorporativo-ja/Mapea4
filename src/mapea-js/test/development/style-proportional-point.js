import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleProportional from 'facade/js/style/Proportional';
import StylePoint from 'facade/js/style/Point';

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
