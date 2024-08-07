import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleChoropleth from 'M/style/Choropleth';
import * as StyleQuantification from 'M/style/Quantification';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
});

mapjs.addLayers([wfs]);
const stylechoropleth = new StyleChoropleth('u_cod_prov', ['#ff0000', '#0000ff'], StyleQuantification.QUANTILE());
wfs.setStyle(stylechoropleth);

window.mapjs = mapjs;
