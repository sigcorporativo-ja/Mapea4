import { map } from 'facade/js/mapea';
import Geosearch from 'plugins/geosearch/facade/js/geosearch';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new Geosearch({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
