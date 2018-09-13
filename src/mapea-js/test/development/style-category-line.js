import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleCategory from 'M/style/Category';
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
const stylecategory = new StyleCategory('nombre', {
  'Río Cacín': new StyleLine({
    fill: {
      color: 'red',
    },
    stroke: {
      color: 'black',
      width: 5,
    },
  }),
  other: new StyleLine({
    stroke: {
      color: 'white',
      width: 5,
    },
    fill: {
      color: 'black',
    },
  }),
});
wfs.setStyle(stylecategory);

window.mapjs = mapjs;
