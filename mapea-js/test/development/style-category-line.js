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
const stylecategory = new StyleCategory('destino', {
  Osuna: new StyleLine({
    fill: { color: 'red' },
    stroke: { color: 'red', width: 5 },
  }),
  other: new StyleLine({
    fill: { color: 'black' },
    stroke: { color: 'black', width: 2 },

  }),
});
wfs.setStyle(stylecategory);

window.mapjs = mapjs;
