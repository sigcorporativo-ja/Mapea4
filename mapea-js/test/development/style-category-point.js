import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleCategory from 'M/style/Category';
import StylePoint from 'M/style/Point';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
  namespace: 'sepim',
  name: 'campamentos',
  legend: 'Campamentos',
  geometry: 'Point',
});

mapjs.addLayers([wfs]);
const stylecategory = new StyleCategory('nom_prov', {
  Almería: new StylePoint({
    fill: {
      color: 'red',
    },
    radius: 10,
  }),
  Córdoba: new StylePoint({
    stroke: {
      color: 'blue',
      width: 5,
    },
    radius: 15,
  }),
  other: new StylePoint({
    stroke: {
      color: 'white',
      width: 5,
    },
    fill: {
      color: 'black',
    },
    radius: 8,
  }),
});
wfs.setStyle(stylecategory);

window.mapjs = mapjs;
