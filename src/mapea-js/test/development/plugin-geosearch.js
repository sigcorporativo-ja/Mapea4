import Geosearch from 'plugins/geosearch/facade/js/geosearch';

const mapjs = M.map({
  container: 'map',
});

const plugin = new Geosearch({});

const layer = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
  ids: '3,4',
});

mapjs.addPlugin(plugin);

mapjs.addLayers(layer);

window.plugin = plugin;
window.mapjs = mapjs;
