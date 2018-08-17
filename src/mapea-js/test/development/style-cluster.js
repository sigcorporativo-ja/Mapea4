import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleCluster from 'facade/js/style/Cluster';
import AttributeTable from 'plugins/attributetable/facade/js/attributetable';
import Geosearch from 'plugins/geosearch/facade/js/geosearch';
import GeosearchByLocation from 'plugins/geosearchbylocation/facade/js/geosearchbylocation';
import Measurebar from 'plugins/measurebar/facade/js/measurebar';
import Printer from 'plugins/printer/facade/js/printer';
import Searchstreet from 'plugins/searchstreet/facade/js/searchstreet';
import SearchstreetGeosearch from 'plugins/searchstreetgeosearch/facade/js/searchstreetgeosearch';
import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';


window.mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  namespace: 'ggis',
  name: 'Colegios',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers([wfs]);

const stylecluster = new StyleCluster();

wfs.setStyle(stylecluster);
