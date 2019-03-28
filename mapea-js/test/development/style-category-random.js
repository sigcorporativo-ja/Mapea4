import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleCategory from 'M/style/Category';

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
