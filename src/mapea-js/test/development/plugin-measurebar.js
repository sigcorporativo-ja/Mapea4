import Measurebar from 'plugins/measurebar/facade/js/measurebar';

const mapjs = M.map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new Measurebar({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
