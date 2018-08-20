import { map } from 'facade/js/mapea';
import GeoJSON from 'facade/js/layer/GeoJSON';

const mapjs = map({
  container: 'map',
});

// mapjs.addLayers(new GeoJSON({
//   name: 'capaJson',
//   source: {
//     type: 'FeatureCollection',
//     features: [{
//       properties: {
//         estado: 1,
//         vendor: {
//           mapea: {},
//         },
//         sede: '/Sevilla/CHGCOR003-Oficina de la zona regable del Genil',
//         tipo: 'ADSL',
//         name: '/Sevilla/CHGCOR003-Oficina de la zona regable del Genil',
//       },
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-5.278075, 37.69374444444444],
//       },
//     }],
//     crs: {
//       properties: {
//         name: 'EPSG:4326',
//       },
//       type: 'name',
//     },
//   },
// }));

const layer = new GeoJSON({
  name: 'Provincias',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json',
});

mapjs.addLayers(layer);

window.mapjs = mapjs;
