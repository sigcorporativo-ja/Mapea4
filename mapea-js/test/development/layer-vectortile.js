import { map as Mmap } from 'M/mapea';
import MVT from 'M/layer/MVT';
import stylePolygon from 'M/style/Polygon';
import stylePoint from 'M/style/Point';

window.stylePolygon = stylePolygon;
window.stylePoint = stylePoint;

const mapjs = Mmap({
  container: 'map',
  projection: 'EPSG:25830*m',
  controls: ['mouse'],
  layers: ['OSM']
});

// MVT*URL*NAME

// const mvt = new MVT('MVT*https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf*vectortile');

const mvt = new MVT({
  url: 'http://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/gwc/service/tms/1.0.0/Global:prueba_258_nueva_81ebe761_d6c8_44fe_a8fc_df4a08814fc3@EPSG%3A25830@pbf/{z}/{x}/{-y}.pbf',
  name: 'vectortile',
  projection: 'EPSG:25830',
});

mapjs.addLayers(mvt);
window.mapjs = mapjs;
