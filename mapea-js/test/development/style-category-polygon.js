import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleCategory from 'M/style/Category';
import StylePolygon from 'M/style/Polygon';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  namespace: 'mapea',
  name: 'da_provincia',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers([wfs]);
const stylecategory = new StyleCategory('nombre', {
  ALMERÍA: new StylePolygon({
    fill: {
      color: 'red',
    },
  }),
  CÓRDOBA: new StylePolygon({
    stroke: {
      color: 'blue',
      width: 5,
    },
  }),
  other: new StylePolygon({
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
