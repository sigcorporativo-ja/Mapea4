import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleLine from 'M/style/Line';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const styleline = new StyleLine({
  fill: {
    color: 'red',
  },
  stroke: {
    color: 'black',
    width: 3,
  },
});

const wfs = new WFS({
  url: 'http://www.ideandalucia.es/services/DERA_g3_hidrografia/wfs',
  namespace: 'DERA_g3_hidrografia',
  name: 'g03_08_Conduccion',
  legend: 'Rios',
  geometry: 'LINE',
});

mapjs.addLayers(wfs);
wfs.setStyle(styleline);

window.mapjs = mapjs;
