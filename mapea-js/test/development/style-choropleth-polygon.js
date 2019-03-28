import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleChoropleth from 'M/style/Choropleth';
import * as StyleQuantification from 'M/style/Quantification';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  namespace: 'mapea',
  name: 'da_provincia',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});


mapjs.addLayers([wfs]);
const stylechoropleth = new StyleChoropleth('area', ['#ff0aee', '#040fef'], StyleQuantification.QUANTILE());
wfs.setStyle(stylechoropleth);

window.mapjs = mapjs;
