import { map as Mmap } from 'M/mapea';
import * as Utils from 'M/util/Utils';
import GeoJSON from 'M/layer/GeoJSON';
import Point from 'M/style/Point';

const mapa = Mmap({
  container: 'map',
  controls: ['layerswitcher']
});

const l = new GeoJSON({
  source: {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
          color: "#0ff"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -6.0205078125,
            37.579412513438385
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "color": "#f0f"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -4.833984374999999,
            37.92686760148135
          ]
        }
      }
    ]
  },
  name: 'wenas'
}, {
  style: new Point({
    radius: 14,
    fill: {
      color: "{{color}}"
    }
  })
});

mapa.addLayers(l);
