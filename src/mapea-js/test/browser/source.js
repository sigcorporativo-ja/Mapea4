import M from 'facade/js/Mapea';
import GeoJSON from 'facade/js/layer/GeoJSON';

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
          "type": "LineString",
          "coordinates": [
          [
            -24.78515625,
            25.64152637306577
          ],
          [
            18.984375,
            42.8115217450979
          ],
          [
            -8.61328125,
            50.958426723359935
          ],
          [
            -28.125,
            36.73888412439431
          ],
          [
            -9.667968749999998,
            24.046463999666567
          ]
        ]
        }
    },
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
  projection: 'EPSG:4326*d',
  container: 'map',
  controls: ['mouse'],
});
