import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleHeatmap from 'M/style/Heatmap';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  url: 'https://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
  namespace: 'sepim',
  name: 'campamentos',
  legend: 'Campamentos',
  geometry: 'Point',
});

mapjs.addLayers([wfs]);
const styleheatmap = new StyleHeatmap('telefono', {
  blur: 20,
  radius: 15,
  gradient: ['red', 'black', 'blue', 'pink', 'green', 'white'],
});
wfs.setStyle(styleheatmap);

window.mapjs = mapjs;
