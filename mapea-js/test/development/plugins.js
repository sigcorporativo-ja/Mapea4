import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';

const mapjs = M.map({
  container: 'map',
  bbox: [101939.9568784085, 3994315.0604398763, 609204.6625118998, 4272704.5164090395],
  projection: 'EPSG:25830*m',
});

const plugins = new WFSTControls(['drawfeature', 'modifyfeature', 'deletefeature', 'editattribute']);

// mapjs.addLayers('WFST*CapaWFS*http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?*tematicos:Provincias*MPOLYGON');
mapjs.addLayers('WMS*Callejero%20Andaluc%C3%ADa*http://www.callejerodeandalucia.es/servicios/base/wms?%27*CDAU_base*false*true**1.3.0*image/png');
mapjs.addLayers('WFS*Colegios*http://g-gis-online-lab.desarrollo.guadaltel.es/geoserver/ggiscloud_root/wfs?*a1592900170430_colegios*POINT');

mapjs.addPlugin(plugins);
window.mapjs = mapjs;


// http://mapea-chg.desarrollo.guadaltel.es/mapea5/?layers=
// WMS*Callejero%20Andaluc%C3%ADa*http://www.callejerodeandalucia.es/servicios/base/wms?%27*CDAU_base*false*true**1.3.0*image/png,
// WFS*Colegios*http://g-gis-online-lab.desarrollo.guadaltel.es/geoserver/ggiscloud_root/wfs?*a1592900170430_colegios*POINT
// &bbox=101939.9568784085,3994315.0604398763,609204.6625118998,4272704.5164090395
// &wfstcontrols=drawfeature,modifyfeature,deletefeature,editattribute
// &projection=EPSG:25830*m


// http://g-gis-online-lab.desarrollo.guadaltel.es/geoserver/ggiscloud_root/wfs_
