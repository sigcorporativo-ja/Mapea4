// constructor del mapa
let mapajs = M.map({
  container: "map",
  projection: "EPSG:4326*d",
  layers: ["OSM"],
  center: {
    x: -5.9584180843195425,
    y: 37.36912689160224
  },
  zoom: 5,
  controls: ['layerswitcher', 'overviewmap'],
});

let point = new M.Feature("punto", {
  "type": "Feature",
  "properties": {
    "c": 'red',
    "size": 40
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -3.99140625,
          38.04015683604136
        ]
  }
});

let stylePoint = new M.style.Point({
  radius: "{{size}}"
});
