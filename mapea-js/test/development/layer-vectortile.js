import { map as Mmap, proxy } from 'M/mapea';
import MVT from 'M/layer/MVT';

proxy(false)
const mapjs = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['mouse'],
  layers: ['OSM'],
});

const mvt = new MVT({
  url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/CHG:carmenmarquez_municipios_20200916_16431@EPSG:900913@pbf/{z}/{x}/{-y}.pbf',
  name: 'vectortile',
  projection: 'EPSG:3857',
},
// {},
// {
//   tileLoadFunction: function() {
//     console.log('loading tile mvt');
//   },
// }
);

mvt.on('added:map', () => {
  console.log('mvt añadido');
});
mapjs.addLayers(mvt);
window.mapjs = mapjs;
