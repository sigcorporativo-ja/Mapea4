import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StylePoint from 'M/style/Point';

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
