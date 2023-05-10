// import Printerdos from 'plugins/printerdos/facade/js/printerdos';
import SearchstreetGeosearch from 'plugins/searchstreetgeosearch/facade/js/searchstreetgeosearch';

const mapjs = M.map({
container: 'map',
controls: ['layerswitcher'],
});

mapjs.addPlugin(new SearchstreetGeosearch());

window.mapjs = mapjs;
