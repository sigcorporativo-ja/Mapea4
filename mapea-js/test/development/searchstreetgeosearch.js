import { map as Mmap } from 'M/mapea';
import MPlugin from 'M/Plugin';
window.M.Plugin = MPlugin;
import MSearchstreetGeosearch from 'plugins/searchstreetgeosearch/facade/js/searchstreetgeosearch';
import 'plugins/searchstreetgeosearch/facade/js/autocomplete';

const mapjs = Mmap({
  container: 'map',
});

mapjs.addPlugin(new MSearchstreetGeosearch({}));

window.mapjs = mapjs;
