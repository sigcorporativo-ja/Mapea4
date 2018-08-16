import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleHeatmap from 'facade/js/style/Heatmap';

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
const styleheatmap = new StyleHeatmap('Prueba', {
  blur: 20,
  radius: 15,
  gradient: ['red', 'black', 'blue', 'pink', 'green', 'white'],
});
wfs.setStyle(styleheatmap);

window.mapjs = mapjs;
