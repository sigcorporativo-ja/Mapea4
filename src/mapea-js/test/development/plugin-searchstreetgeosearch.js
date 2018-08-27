import { map } from 'facade/js/mapea';
import SearchstreetGeosearch from 'plugins/searchstreetgeosearch/facade/js/searchstreetgeosearch';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new SearchstreetGeosearch({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
