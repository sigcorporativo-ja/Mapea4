import { map } from 'facade/js/mapea';
import Measurebar from 'plugins/measurebar/facade/js/measurebar';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new Measurebar({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
