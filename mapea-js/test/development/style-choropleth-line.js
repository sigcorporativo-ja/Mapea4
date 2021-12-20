import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleChoropleth from 'M/style/Choropleth';
import * as StyleQuantification from 'M/style/Quantification';

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
const stylechoropleth = new StyleChoropleth('id', ['#ff0aee', '#040fef'], StyleQuantification.JENKS(3));
wfs.setStyle(stylechoropleth);

window.mapjs = mapjs;
