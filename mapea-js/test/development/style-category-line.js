import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleCategory from 'M/style/Category';
import StyleLine from 'M/style/Line';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  url: 'http://www.ideandalucia.es/services/DERA_g3_hidrografia/wfs',
  namespace: 'DERA_g3_hidrografia',
  name: 'g03_08_Conduccion',
  legend: 'Rios',
  geometry: 'LINE',
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
