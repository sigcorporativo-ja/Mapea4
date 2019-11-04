import GeosearchByLocation from 'plugins/geosearchbylocation/facade/js/geosearchbylocation';

const mapjs = M.map({
  container: 'map',
  layers: ['OSM'],
});

const plugin = new GeosearchByLocation({});

mapjs.addPlugin(plugin);

window.plugin = plugin;
window.mapjs = mapjs;
