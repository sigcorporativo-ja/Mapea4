import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleProportional from 'M/style/Proportional';
import StylePoint from 'M/style/Point';

const mapjs = map({
  container: 'map',
  controls: ['layerswitcher'],
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows',
  name: 'sepim:campamentos',
  legend: 'Campamentos',
  geometry: 'POINT',
  extract: true,
});

mapjs.addLayers([wfs]);
const stylepoint = new StylePoint({
  fill: { color: 'red' },
  stroke: { color: 'white', stroke: 4 },
});
const styleproportional = new StyleProportional('yutm', 15, 30);
styleproportional.add(stylepoint);
wfs.setStyle(styleproportional);

window.mapjs = mapjs;
