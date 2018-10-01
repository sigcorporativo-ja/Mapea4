import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import GeoJSON from 'M/layer/GeoJSON';
import { SELECT_FEATURES } from 'M/event/eventtype';
import Feature from 'M/feature/Feature';

const jsts = require('jsts/dist/jsts.js');

const mapajs = map({
  container: 'map',
  controls: ['layerswitcher'],
});

// GeoJSON servido
const lyProvincias = new WFS({
  name: 'Provincias',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wfs',
  namespace: 'tematicos',
});

const lyEnvelope = new GeoJSON({
  source: {
    crs: {
      properties: {
        name: 'EPSG:25830',
      },
      type: 'name',
    },
    features: [],
    type: 'FeatureCollection',
  },
  name: 'envelope',
});

lyProvincias.on(SELECT_FEATURES, (features) => {
  const parser = new jsts.io.GeoJSONReader();
  const f = parser.read(features[0].getGeoJSON());
  const objEnv = f.geometry.getEnvelopeInternal();

  const fEnv = new Feature(features[0].getAttribute('nombre'), {
    type: 'Feature',
    id: 'fEnv',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [objEnv._minx, objEnv._miny],
        [objEnv._minx, objEnv._maxy],
        [objEnv._maxx, objEnv._maxy],
        [objEnv._maxx, objEnv._miny]
      ]],
    },
    geometry_name: 'the_geom',
    properties: {
      nombre: 'envelope',
    },
  });

  lyEnvelope.clear();
  lyEnvelope.addFeatures(fEnv);
});

mapajs.addLayers([lyProvincias, lyEnvelope]);
