import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleChoropleth from 'M/style/Choropleth';
import * as StyleQuantification from 'M/style/Quantification';

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
const stylechoropleth = new StyleChoropleth('telefono', ['#ff0aee', '#040fef'], StyleQuantification.JENKS(3));
wfs.setStyle(stylechoropleth);

window.mapjs = mapjs;
