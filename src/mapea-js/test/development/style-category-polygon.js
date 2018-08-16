import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleCategory from 'facade/js/style/Category';
import StylePolygon from 'facade/js/style/Polygon';

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
