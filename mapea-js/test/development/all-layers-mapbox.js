import { map } from 'M/mapea';
import WMS from 'M/layer/WMS';
import WFS from 'M/layer/WFS';
import KML from 'M/layer/KML';
import GeoJSON from 'M/layer/GeoJSON';


window.mapjs = map({
  container: 'map',
  layers: ['OSM'],
  projection: 'EPSG:3857*m',
});

const wms = new WMS({
  url: 'http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/grid/wms?',
  name: 'gridp_250',
  namespace: "grid",
}, {}, {
  // cql: `cmun LIKE '%18%'`,
},);

const wfs = new WFS({
  namespace: 'ggis',
  name: 'Colegios',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

const kml = new KML({
  url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
});

const geojson = new GeoJSON({
  name: 'geojson',
  source: {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            -5.767822265625,
            37.47485808497102,
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            -5.4052734375,
            37.52715361723378,
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            -4.801025390625,
            37.88352498087131,
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            -5.515136718749999,
            37.081475648860525,
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            -4.9658203125,
            37.19533058280065,
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            -3.6254882812499996,
            37.34395908944491,
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            -3.80126953125,
            37.96152331396614,
          ],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            -4.515380859375,
            37.64903402157866,
          ],
        },
      },
    ],
  },
});

mapjs.addLayers([wms, wfs, kml, geojson]);
