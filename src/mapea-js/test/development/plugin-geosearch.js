import Geosearch from 'plugins/geosearch/facade/js/geosearch';

const mapjs = M.map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new Geosearch({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
