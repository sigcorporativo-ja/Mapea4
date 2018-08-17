import GeosearchByLocation from 'plugins/geosearchbylocation/facade/js/geosearchbylocation';

const mapjs = M.map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new GeosearchByLocation({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
