import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleProportional from 'M/style/Proportional';
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
const styleline = new StyleLine({
  fill: { color: 'red' },
  stroke: { color: 'black', width: 3 },
});
const styleproportional = new StyleProportional('id_dera', 15, 30);
styleproportional.add(styleline);
wfs.setStyle(styleproportional);

window.mapjs = mapjs;
