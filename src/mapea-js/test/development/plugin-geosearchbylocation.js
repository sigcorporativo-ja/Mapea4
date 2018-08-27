import { map } from 'facade/js/mapea';
import GeosearchByLocation from 'plugins/geosearchbylocation/facade/js/geosearchbylocation';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new GeosearchByLocation({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
