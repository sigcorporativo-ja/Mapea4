import { map as Mmap } from 'M/mapea';
import MVT from 'M/layer/MVT';
import stylePolygon from 'M/style/Polygon';
import stylePoint from 'M/style/Point';

window.stylePolygon = stylePolygon;
window.stylePoint = stylePoint;

const mapjs = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['mouse'],
  layers: ['OSM', 'MVT*http://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/gwc/service/tms/1.0.0/Global:distritos_geojson_59debd88_403b_47ce_a68e_24d539505810@EPSG:900913@pbf/{z}/{x}/{-y}.pbf*mvt'],
});

// MVT*URL*NAME

// const mvt = new MVT('MVT*https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf*vectortile');

// const mvt = new MVT({
//   url: 'http://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/gwc/service/tms/1.0.0/Global:distritos_geojson_59debd88_403b_47ce_a68e_24d539505810@EPSG:900913@pbf/{z}/{x}/{-y}.pbf',
//   name: 'vectortile',
// });

window.mapjs = mapjs;
