// constructor del mapa

let mapajs = M.map({
  container: "map",
  projection: "EPSG:4326*d",
  layers: ["OSM"],
  // center: {
  //   x: -5.9584180843195425,
  //   y: 37.36912689160224
  // },
  // zoom: 10,
  controls: ['layerswitcher', 'overviewmap'],
});

let style = new M.style.Point({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 2
});

let style2 = new M.style.Point({
  fill: {
    color: 'black'
  },
  stroke: {
    color: 'red',
    width: 1
  },
  radius: 3
});

let feature = new M.Feature('feature', {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [
          -3.983428955078124,
          30.38761749978395
        ]
  }
}, style);

let feature2 = new M.Feature('feature', {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [
          -4.983428955078124,
          36.38761749978395
        ]
  }
}, style2);
let layer = new M.layer.Vector({
  name: 'layerVector'
});

mapajs.addLayers([layer]);
layer.addFeatures([feature, feature2]);
