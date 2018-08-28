import Geosearch from 'plugins/geosearch/facade/js/geosearch';

const mapjs = M.map({
  container: 'map',
});

const plugin = new Geosearch({});

mapjs.addPlugin(plugin);

window.plugin = plugin;
window.mapjs = mapjs;
