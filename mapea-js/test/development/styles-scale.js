import { map as Mmap } from 'M/mapea';
import MlayerWFS from 'M/layer/WFS';
import MstylePolygon from 'M/style/Polygon';
import MstylePoint from 'M/style/Point';

const mapjs = Mmap({
  container: 'map',
});

window.mapjs = mapjs;

window.polygons = new MlayerWFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Provincias",
  geometry: 'MPOLYGON'
}, {
  style: new MstylePolygon({
    fill: {
      color: '#ececec',
      opacity: (f, m) => m.getScale() > 510000 ? 1 : 0
    },
    stroke: {
      color: '#0f98e8',
      width: 5
    }
  })
});
window.points = new MlayerWFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows",
  name: "sepim:campamentos",
  legend: "Campamentos",
  geometry: 'POINT',
  extract: true
}, {
  style: new MstylePoint({
    fill: {
      color: '#fff',
      opacity: (f, m) => m.getScale() <= 510000 ? 1 : 0
    },
    radius: (f, m) => m.getScale() <= 510000 ? 20 : 0,
    stroke: {
      color: '#ec0b0b',
      width: 2
    }
  })
});

mapjs.addLayers([window.polygons, window.points]);
