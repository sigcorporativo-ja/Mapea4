import { map as Mmap } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleCategory from 'facade/js/style/Category';

const mapjs = Mmap({
  container: 'map',
});
// Capa de municipios
const layer = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'ind_mun_simp',
  legend: 'Municipios SIM',
  geometry: 'MPOLYGON',
});

mapjs.addLayers([layer]);
const categoryStylep = new StyleCategory('municipio');
layer.setStyle(categoryStylep);

window.mapjs = mapjs;
