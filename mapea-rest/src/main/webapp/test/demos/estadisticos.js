// Definimos el mapa
let mapajs = M.map({
  container: "mapjs",
  controls: ['mouse', 'layerswitcher', 'panzoombar'],
  layers: ['MAPBOX*mapbox.streets'],
  projection: 'EPSG:3857*m',
  center: [-6177882.14211597, -3756535.732197249],
  zoom: 6
})

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

for (let i = 0; i < 50; i++) {
  features.push(generateFeature(`${i}`, {
    xCoord: -6077882.14211597,
    yCoord: -3676535.732197249,
    xError: 400240,
    yError: 400173
  }));
}

features.forEach((feature, i) => {
  feature.setAttribute("name", `centro ${i+1}`);
  feature.setAttribute("data_1", generateData(600));
  feature.setAttribute("data_2", generateData(500));
  feature.setAttribute("data_3", generateData(200));
});

let layer = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Provincias",
  geometry: 'MPOLYGON'
});
layer.removeFeatures()
layer.addFeatures(features);
mapajs.addLayers(layer);

let stylechart = new M.style.Chart({
  type: M.style.chart.types.PIE,
  animation: true,
  radius: 18,
  offsetX: 0,
  offsetY: 0,
  scheme: M.style.chart.schemes.Classic,
  stroke: {
    color: 'white',
    width: 1
  },
  variables: [{
    attribute: "data_1",
    label: {
      stroke: {
        color: 'black',
        width: 2
      },
      fill: M.style.chart.schemes.Classic[0],
      text: function(value, values, feature) {
        return value.toString();
      }
    }
  }, {
    attribute: "data_2",
    label: {
      stroke: {
        color: 'white',
        width: 2
      },
      fill: M.style.chart.schemes.Classic[1],
      text: function(value, values, feature) {
        return value.toString();
      }
    }
  }, {
    attribute: "data_3",
    label: {
      stroke: {
        color: 'white',
        width: 2
      },
      fill: M.style.chart.schemes.Classic[2],
      text: function(value, values, feature) {
        return value.toString();
      }
    }
  }]
});

layer.setStyle(stylechart);
