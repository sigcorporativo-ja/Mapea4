import M from 'facade/js/mapea';
import GeoJSON from 'facade/js/layer/GeoJSON';
import StylePoint from 'facade/js/style/Point';

window.StylePoint = StylePoint;
window.M = M;
window.geojson = new GeoJSON({
  name: "mi geojson",
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -14.23828125,
          42.8115217450979
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.6796875,
          37.579412513438385
        ]
        }
    }
  ]
  }
})

window.map = M.map({
  layers: ["OSM"],
  // projection: 'EPSG:4326*d',
  container: 'map',
  controls: ['mouse', 'layerswitcher'],
});

map.addLayers(geojson);
