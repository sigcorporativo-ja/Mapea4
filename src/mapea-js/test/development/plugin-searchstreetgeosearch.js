import SearchstreetGeosearch from 'plugins/searchstreetgeosearch/facade/js/searchstreetgeosearch';

const mapjs = M.map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new SearchstreetGeosearch({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
