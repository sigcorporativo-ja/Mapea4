import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StylePoint from 'facade/js/style/Point';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
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
    color: 'blue',
    opacity: 0.4,
  },
  stroke: {
    width: 5,
    color: 'green',
  },
  radius: 13,
});
wfs.setStyle(stylepoint);

window.mapjs = mapjs;
