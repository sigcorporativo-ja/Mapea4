import Measurebar from 'plugins/measurebar/facade/js/measurebar';

const mapjs = M.map({
  container: 'map',
});

const plugin = new Measurebar({});

mapjs.addPlugin(plugin);

window.plugin = plugin;
window.mapjs = mapjs;
