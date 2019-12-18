import AttributeTable from 'plugins/attributetable/facade/js/attributetable';
import Measurebar from 'plugins/measurebar/facade/js/measurebar';
import Geosearch from 'plugins/geosearch/facade/js/geosearch';
import Searchstreet from 'plugins/searchstreet/facade/js/searchstreet';
import Printer from 'plugins/printer/facade/js/printer';
import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';
import GeosearchByLocation from 'plugins/geosearchbylocation/facade/js/geosearchbylocation';
import GeosearchByCoordinates from 'plugins/geosearchbycoordinates/facade/js/geosearchbycoordinates';
import SearchstreetGeosearch from 'plugins/searchstreetgeosearch/facade/js/searchstreetgeosearch';

const mapjs = M.map({
  container: 'map',
});

const plugins = {
  attributetable: new AttributeTable({}),
  measurebar: new Measurebar(),
  geosearch: new Geosearch(),
  searchstreet: new Searchstreet(),
  printer: new Printer(),
  wfstcontrols: new WFSTControls(['editattribute', 'clearfeature', 'deletefeature', 'draefeature', 'modifyfeature', 'savefeature']),
  // geosearchbylocation: new GeosearchByLocation(),
  geosearchbycoordinates: new GeosearchByCoordinates(),
  searchstreetgeosearch: new SearchstreetGeosearch(),
};

mapjs.addLayers('WFST*CapaWFS*http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?*tematicos:Provincias*MPOLYGON');
