// import { map } from 'facade/js/mapea';
import Searchstreet from 'plugins/searchstreet/facade/js/searchstreet';

const mapjs = M.map({
  container: 'map',
  controls: ['mouse', 'layerswitcher'],
});

mapjs.addPlugin(new Searchstreet({}));

window.mapjs = mapjs;
