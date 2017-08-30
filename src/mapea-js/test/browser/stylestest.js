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

let points = new M.layer.GeoJSON({
  name: 'points',
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.207275390625,
          38.06971703320484
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.6689453125,
          38.013476231041935
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.5810546875,
          37.243448378654115
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -4.89990234375,
          37.44433544620035
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.2237548828125,
          37.23032838760387
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.520385742187499,
          37.70120736474139
        ]
        }
    }
  ]
  }
});
let lines = new M.layer.GeoJSON({
  name: 'lines',
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
            -3.8452148437499996,
            37.93553306183642
          ],
          [
            -1.669921875,
            38.42777351132902
          ],
          [
            -3.27392578125,
            37.1165261849112
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -2.724609375,
            37.92686760148135
          ],
          [
            -4.427490234375,
            37.16031654673677
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -1.636962890625,
            38.71123253895224
          ],
          [
            -5.020751953125,
            38.91668153637508
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -1.669921875,
            38.57393751557591
          ],
          [
            -4.647216796875,
            37.90953361677018
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -1.395263671875,
            38.42777351132902
          ],
          [
            -2.109375,
            37.18657859524883
          ],
          [
            -3.482666015625,
            36.78289206199065
          ],
          [
            -4.68017578125,
            36.85325222344018
          ]
        ]
        }
    }
  ]
  }
});
let polygons = new M.layer.GeoJSON({
  name: 'polygons',
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -5.5810546875,
              40.713955826286046
            ],
            [
              -6.734619140625,
              40.153686857794035
            ],
            [
              -6.383056640625,
              39.78321267821705
            ],
            [
              -6.8994140625,
              39.47860556892209
            ],
            [
              -6.492919921875,
              39.39375459224348
            ],
            [
              -5.833740234375,
              39.38526381099774
            ],
            [
              -5.33935546875,
              39.78321267821705
            ],
            [
              -5.5810546875,
              40.713955826286046
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -3.2080078125,
              40.6723059714534
            ],
            [
              -4.515380859375,
              41.12074559016745
            ],
            [
              -4.625244140625,
              40.01078714046552
            ],
            [
              -3.779296875,
              39.715638134796336
            ],
            [
              -4.603271484375,
              39.26628442213066
            ],
            [
              -4.4384765625,
              39.00211029922515
            ],
            [
              -3.834228515625,
              38.98503278695909
            ],
            [
              -2.669677734375,
              39.605688178320804
            ],
            [
              -2.35107421875,
              40.22082997283287
            ],
            [
              -3.2080078125,
              40.6723059714534
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -6.50390625,
              41.43449030894922
            ],
            [
              -7.536621093749999,
              40.871987756697415
            ],
            [
              -7.448730468749999,
              40.027614437486655
            ],
            [
              -6.50390625,
              41.43449030894922
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -8.536376953125,
              39.46164364205549
            ],
            [
              -8.67919921875,
              37.53586597792038
            ],
            [
              -7.404785156249999,
              38.75408327579141
            ],
            [
              -7.943115234375001,
              39.631076770083666
            ],
            [
              -8.536376953125,
              39.46164364205549
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -6.921386718749999,
              38.47939467327645
            ],
            [
              -7.921142578125,
              37.23032838760387
            ],
            [
              -6.976318359375,
              36.1822249804225
            ],
            [
              -6.6796875,
              37.49229399862877
            ],
            [
              -6.383056640625,
              36.81808022778526
            ],
            [
              -5.899658203125,
              37.996162679728116
            ],
            [
              -6.943359374999999,
              37.779398571318765
            ],
            [
              -6.921386718749999,
              38.47939467327645
            ]
          ]
        ]
        }
    }
  ]
  }
});
mapajs.addLayers([points, lines, polygons]);

let point = points.getFeatures()[0];
let line = lines.getFeatures()[0];
let polygon = polygons.getFeatures()[0];

// Estilos nulos (deben ponerse por defecto)
let nullStylePoint = new M.style.Point({});
let nullStyleLine = new M.style.Line({});
let nullStylePolygon = new M.style.Polygon({});

// Estilos solo color
let colorStylePoint = new M.style.Point({
  fill: {
    color: 'red'
  }
});
let colorStyleLine = new M.style.Line({
  stroke: {
    color: 'red'
  }
});
let colorStylePolygon = new M.style.Polygon({
  fill: {
    color: 'red'
  }
});


// Estilos stroke
let strokeStylePoint = new M.style.Point({
  stroke: {
    color: 'red'
  }
});
let strokeStylePolygon = new M.style.Polygon({
  stroke: {
    color: 'red'
  }
});

// estilo radius

let radiusStylePoint = new M.style.Point({
  radius: 9
});

//============================================================================
// Ejemplos variados de estilos de puntos

let stylePoint = new M.style.Point({
  stroke: {
    color: '#C8FE2E',
    width: 15,
    linedash: [1, 20],
    linedashoffset: 60,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15
  },
  radius: 20
});
let stylePoint2 = new M.style.Point({
  radius: 20,
  fill: {
    color: 'red',
    opacity: 0.5
  }
});
let stylePoint3 = new M.style.Point({
  radius: 25,
  label: {
    text: 'FEATURE',
    font: 'bold italic 19px Comic Sans MS',
    rotate: false,
    scale: 0.9,
    offset: [10, 20],
    color: '#2EFEC8',
    stroke: {
      color: 'blue',
      width: 23,
      linedash: [1, 20],
      linedashoffset: 60,
      linecap: 'square',
      linejoin: 'miter',
      miterlimit: 15
    },
    rotate: false,
    rotation: 0.5,
    align: M.style.align.RIGHT,
    baseline: M.style.baseline.TOP
  }
});
let stylePoint4 = new M.style.Point({
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
    offset: [10, 0],
    crossorigin: null,
    snaptopixel: true,
    offsetorigin: 'bottom-left',
  }
});
let stylePoint5 = new M.style.Point({
  fill: {
    color: 'red',
    opacity: 1
  },
  stroke: {
    color: 'yellow',
    width: 3
  },
  radius: 7,
  icon: {
    src: 'https://cdn3.iconfinder.com/data/icons/free-icons-3/128/cat_6.png',
    rotation: 0.5,
    scale: 0.5,
    opacity: 0.8,
    anchor: [0.5, 1.9],
    anchororigin: 'top-rigth',
    anchororigin: 'top-right',
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

//=============================================================================
// Ejemplos variados de linea

// EJEMPLO CON STROKE
let styleLine = new M.style.Line({
  stroke: {
    color: '#C8FE2E',
    width: 15,
    linedash: [1, 20],
    linedashoffset: 60,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15
  }
});



// EJEMPLO CON STROKE + FILL
let styleLine2 = new M.style.Line({
  stroke: {
    color: '#C8FE2E',
    width: 50,
    linedash: [1, 20],
    linedashoffset: 60,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15
  },
  fill: {
    color: 'blue',
    opacity: 0.7,
    width: 15
  }
});



// EJEMPLO TEXT
let styleLine3 = new M.style.Line({
  label: {
    text: 'FEATURE',
    font: 'bold italic 19px Comic Sans MS',
    rotate: false,
    scale: 0.9,
    offset: [10, 20],
    color: '#2EFEC8',
    stroke: {
      color: '#FE9A2E',
      width: 10
    },
    rotate: false,
    rotation: 0.5,
    align: M.style.align.RIGHT,
    baseline: M.style.baseline.TOP
  }
});


//=============================================================================
// Estilos variados de polígonos

// EJEMPLO LABEL:



// EJEMPLO STROKE
let stylePolygon = new M.style.Polygon({
  stroke: {
    color: '#C8FE2E',
    width: 15,
    linedash: [1, 20],
    linedashoffset: 60,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15
  }
});


// EJEMPLO FILL
let stylePolygon2 = new M.style.Polygon({
  fill: {
    color: '#6A0888',
    opacity: 0.5
  }
});


// EJEMPLO FILL - PATTERN
let stylePolygon3 = new M.style.Polygon({
  stroke: {
    color: '#C8FE2E',
    width: 15,
    linedash: [1, 20],
    linedashoffset: 60,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15
  },
  fill: {
    pattern: {
      name: M.style.pattern.HATCH,
      size: 6,
      spacing: 20,
      rotation: 3,
      offset: [50, 30],
      color: 'red',
      fill: {
        color: 'blue',
        opacity: 0.5
      },
      scale: 2
    }
  }
});


//EJEMPLO FILL + FILL PATTERN
let stylePolygon4 = new M.style.Polygon({
  stroke: {
    color: '#C8FE2E',
    width: 15,
    linedash: [1, 20],
    linedashoffset: 60,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15
  },
  fill: {
    color: '#6A0888',
    opacity: 0.5,
    pattern: {
      name: M.style.pattern.HATCH,
      size: 6,
      spacing: 20,
      rotation: 3,
      offset: [50, 30],
      color: 'red',
      fill: {
        color: 'blue',
        opacity: 0.5
      },
      scale: 2
    }
  }
});

let stylePolygon5 = new M.style.Polygon({
  label: {
    text: 'FEATURE',
    font: 'bold italic 19px Comic Sans MS',
    rotate: false,
    scale: 0.9,
    offset: [10, 20],
    color: '#2EFEC8',
    stroke: {
      color: '#C8FE2E',
      width: 15,
      linedash: [1, 20],
      linedashoffset: 60,
      linecap: 'square',
      linejoin: 'miter',
      miterlimit: 15
    },
    rotation: 0.5,
    align: M.style.align.RIGHT,
    baseline: M.style.baseline.TOP
  }
});


// Setea estilo a nivel de capa
function setStyleLayer(layer, style) {
  layer.setStyle(style);
}

//Setea estilo a nivel de feature
function setStyleFeature(feature, style) {
  feature.setStyle(style);
}

// let polygon = new M.style.Polygon({
//   'fill': {
//     'pattern': {
//       "name": M.style.pattern.HATCH,
//       'src': 'http://www.juntadeandalucia.es/prueba/icon.png',
//       "size": 9,
//       "spacing": 10,
//       "rotation": 50,
//       "offset": [21, 21],
//       "scale": 1,
//       "fill": {
//         'color': '#fff',
//         'opacity': 0.5
//       }
//     },
//     'color': '#6A0888',
//     'opacity': 0.5
//   },
//   'stroke': {
//     'color': '#C8FE2E',
//     'width': 15,
//     'linedash': [1, 20],
//     'linedashoffset': 60,
//     'linecap': 'square',
//     'linejoin': 'miter',
//     'miterlimit': 15
//   },
//   'label': {
//     'rotate': false,
//     'font': 'bold italic 9px family',
//     'scale': 1,
//     'offset': [10, 20],
//     'color': '#BCBCBC',
//     'stroke': {
//       'color': '#C8FE2E',
//       'width': 15,
//       'linedash': [1, 20],
//       'linedashoffset': 60,
//       'linecap': 'square',
//       'linejoin': 'miter',
//       'miterlimit': 15
//     },
//     'align': M.style.align.LEFT,
//     'baseline': M.style.baseline.TOP,
//     'text': 'Feature',
//     'rotation': 0.5
//   }
// });



// let line = new M.style.Line({
//   'stroke': {
//     'color': '#C8FE2E',
//     'width': 15,
//     'linedash': [1, 20],
//     'linedashoffset': 60,
//     'linecap': 'square',
//     'linejoin': 'miter',
//     'miterlimit': 15
//   },
//   'fill': {
//     'color': '#fff',
//     'opacity': 0.5,
//     'width': 15
//   },
//   'label': {
//     'rotate': false,
//     'font': 'bold 9px family',
//     'scale': 1,
//     'offset': [10, 20],
//     'color': '#BCBCBC',
//     'stroke': {
//       'color': '#C8FE2E',
//       'width': 15,
//       'linedash': [1, 20],
//       'linedashoffset': 60,
//       'linecap': 'square',
//       'linejoin': 'miter',
//       'miterlimit': 15
//     },
//     'align': [
//             M.style.align.LEFT,
//             M.style.align.CENTER,
//             M.style.align.RIGHT,
//             M.style.align.JUSTIFY
//         ],
//     'baseline': [
//             M.style.baseline.TOP,
//             M.style.baseline.MIDDLE,
//             M.style.baseline.BOTTOM,
//             M.style.baseline.ALPHABETIC,
//             M.style.baseline.HANGING
//         ]
//   }
// });
