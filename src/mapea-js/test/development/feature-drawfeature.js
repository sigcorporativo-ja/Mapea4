import { map as Mmap } from 'facade/js/mapea';
import Feature from 'facade/js/feature/Feature';

const mapjs = Mmap({
  container: 'map',
  layers: ['OSM'],
  projection: 'EPSG:4326*d',
});

const feature = new Feature('my_feature', {
  type: 'Feature',
  properties: {
    prop: {
      num: 3,
    },
    vendor: {
      mapea: {
        click(evt) {
          console.log(evt);
        },
      },
    },
  },
  geometry: {
    type: 'Point',
    coordinates: [
      -5.4052734375,
      37.52715361723378,
    ],
  },
});

mapjs.drawFeatures(feature);
window.mapjs = mapjs;
