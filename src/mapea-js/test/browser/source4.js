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

let style = new M.style.Point({
  fill: {
    color: 'red'
  },
  radius: 5,
  icon: {
    src: 'https://cdn3.iconfinder.com/data/icons/free-icons-3/128/cat_6.png',
    rotation: 0.5,
    scale: 0.5,
    opacity: 0.8,
    anchor: [0.5, 1.9],
    anchororigin: 'top-left',
    anchororigin: 'top-left',
    anchorxunits: 'fraction',
    anchoryunits: 'fraction',
    rotate: false,
    // offset: [10, 0],
    crossorigin: null,
    snaptopixel: true,
    offsetorigin: 'bottom-left',
    size: [150, 95]
  }
});

let featureP = new M.Feature("f", {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [
          -3.69140625,
          37.84015683604136
        ]
  }
});

let featureP2 = new M.Feature("f2", {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [
          -3.99140625,
          38.04015683604136
        ]
  }
});

// featureP.setStyle(style);
let layer = new M.layer.Vector({
  name: 'layerVector'
}, {
  style: style
});

layer.addFeatures([featureP, featureP2]);


mapajs.addLayers([layer]);


function removeStyle() {
  layer.setStyle(null);
}
