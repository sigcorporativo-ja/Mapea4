import { map as Mmap } from 'M/mapea';
import WMTS from 'M/layer/WMTS';
import Searchstreet from '../../src/plugins/searchstreet/facade/js/searchstreet';

const mapjs = M.map({
  container: 'map',
});

const mp = new Searchstreet({});

mapjs.addPlugin(mp);


window.mapjs = mapjs;
