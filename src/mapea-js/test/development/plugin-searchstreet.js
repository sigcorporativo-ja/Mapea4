import Searchstreet from 'plugins/searchstreet/facade/js/searchstreet';

const mapjs = M.map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new Searchstreet({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
