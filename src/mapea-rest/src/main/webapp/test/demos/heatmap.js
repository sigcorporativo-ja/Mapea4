// Definimos el mapa
let mapajs = M.map({
  container: "map",
  controls: ['mouse', 'layerswitcher', 'panzoombar'],
  layers: ['MAPBOX*mapbox.dark'],
  projection: 'EPSG:3857*m',
  center: [-6177882.14211597, -3756535.732197249],
  zoom: 6
});

const generateData = function(number) {
  let random = Math.random() * number;
  return Math.round(random);
};

const generateCoordinate = function(options) {
  let coordinateX = options.xCoord - Math.random() * options.xError;
  let coordinateY = options.yCoord - Math.random() * options.yError;
  return [coordinateX, coordinateY];
};

const generateFeature = function(id, options) {
  let feature = new M.Feature(id, {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": generateCoordinate(options)
    },
    "properties": {}
  });
  return feature;
}

let features = [];

for (let i = 0; i < 450; i++) {
  features.push(generateFeature(`${i}`, {
    xCoord: -6077882.14211597,
    yCoord: -3676535.732197249,
    xError: 400240,
    yError: 400173
  }));
}

features.forEach((feature, i) => {
  feature.setAttribute("name", `Centro ${i+1}`);
  feature.setAttribute("data_1", generateData(1));
});

let layer = new M.layer.Vector();
layer.addFeatures(features);
mapajs.addLayers(layer);

let styleheatmap = new M.style.Heatmap("data_1", {
  gradient: M.style.chart.schemes.Neon,
  blur: 40,
  radius: 20
});
layer.setStyle(styleheatmap);
