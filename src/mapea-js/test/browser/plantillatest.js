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
        "properties": {
          "id": 23,
          "fill_color": "#ff0000",
          "op": 1,
          "stroke_color": "white",
          "stroke_width": "2"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.03173828125,
          38.762650338334154
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "id": 10,
          "fill_color": "blue",
          "op": "0.4",
          "stroke_color": "black",
          "stroke_width": "3"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -4.24072265625,
          38.8824811975508
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "id": 15,
          "fill_color": "blue",
          "op": "0.4",
          "stroke_color": "green",
          "stroke_width": "3"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.24072265625,
          38.8824811975508
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "id": 40,
          "fill_color": "white",
          "op": "0.4",
          "stroke_color": "yellow",
          "stroke_width": "3"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -7.24072265625,
          38.8824811975508
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "id": 19,
          "fill_color": "#00ff99",
          "op": "0.9",
          "stroke_color": "yellow",
          "stroke_width": "6"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -3.53759765625,
          39.2492708462234
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "id": 17,
          "fill_color": "#3366ff",
          "op": "0.9",
          "stroke_color": "red",
          "stroke_width": "4"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -2.96630859375,
          39.11301365149975
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "id": 17,
          "fill_color": "#f0f099",
          "op": "0.9",
          "stroke_color": "black",
          "stroke_width": "4"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -3.6474609374999996,
          38.71980474264237
        ]
        }
    }
  ]
  },
});
let lines = new M.layer.GeoJSON({
  name: "lines",
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "stroke_color": 'red',
          "stroke_width": '10',
          "fill_color": 'green',
          "fill_op": '0.9',
          "text_label": 'linea 1',
          "label_stroke_color": 'blue'
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.38330078125,
            36.29741818650811
          ],
          [
            -3.570556640625,
            36.94111143010769
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "stroke_color": 'black',
          "stroke_width": '13',
          "fill_color": 'red',
          "fill_op": 1,
          "text_label": 'olakease',
          "label_stroke_color": 'white'
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.438232421875,
            36.474306755095235
          ],
          [
            -3.14208984375,
            37.37015718405753
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "stroke_color": 'green',
          "stroke_width": '20',
          "fill_color": 'black',
          "fill_op": '0.4',
          "text_label": 'linea 2',
          "label_stroke_color": 'blue'
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.635986328124999,
            37.081475648860525
          ],
          [
            -3.065185546875,
            36.730079507078415
          ]
        ]
        }
    }
  ]
  }
});
let polygons = new M.layer.GeoJSON({
  name: "polygons",
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "label_text": "texto de prueba",
          "id": 10,
          "stroke_width": 20
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -6.7840576171875,
              37.98750437106374
            ],
            [
              -7.6080322265625,
              37.783740105227224
            ],
            [
              -7.4871826171875,
              37.37015718405753
            ],
            [
              -6.7840576171875,
              37.98750437106374
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "label_text": "texto de olakease",
          "id": 20,
          "stroke_width": 6

        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -6.624755859375,
              37.714244967649265
            ],
            [
              -7.1356201171875,
              37.374522644077246
            ],
            [
              -6.8719482421875,
              36.778492404594154
            ],
            [
              -6.5972900390625,
              37.07271048132943
            ],
            [
              -6.822509765624999,
              37.4356124041315
            ],
            [
              -6.624755859375,
              37.714244967649265
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "label_text": "poligono",
          "id": 11,
          "stroke_width": 16

        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -6.427001953125,
              37.814123701604466
            ],
            [
              -6.5643310546875,
              37.73162487017297
            ],
            [
              -6.053466796875,
              37.405073750176925
            ],
            [
              -6.427001953125,
              37.814123701604466
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "label_text": "texto de prueba 3",
          "id": 13,
          "stroke_width": 12
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -6.492919921875,
              37.53150992479082
            ],
            [
              -6.663208007812499,
              37.391981943533544
            ],
            [
              -6.5753173828125,
              37.22158045838649
            ],
            [
              -6.240234374999999,
              36.954281585675965
            ],
            [
              -6.2347412109375,
              37.204081555898526
            ],
            [
              -6.3446044921875,
              37.470498470798724
            ],
            [
              -6.492919921875,
              37.53150992479082
            ]
          ]
        ]
        }
    }
  ]
  }
});



let stylePoint = new M.style.Point({
  fill: {
    color: "{{fill_color}}",
    op: "{{op}}"
  },
  stroke: {
    color: "{{stroke_color}}",
    width: "{{stroke_width}}"
  },
  radius: function(feature) {
    let id = feature.getProperties()["id"];
    let radius = 7;
    if (id < 20) {
      radius = id;
    }

    return radius;
  },
  'label': {
    text: '{{text_label}}',
    font: 'bold italic 19px Comic Sans MS',
    rotate: false,
    scale: 0.9,
    // offset: [10, 20],
    color: '#2EFEC8',
    stroke: {
      color: '{{label_stroke_color}}',
      width: 10
    }
  }
});
let styleLine = new M.style.Line({
  'stroke': {
    color: '{{stroke_color}}',
    width: "{{stroke_width}}"
  },
  'fill': {
    color: '{{fill_color}}',
    opacity: "{{fill_op}}",
    width: 6
  },
  'label': {
    text: '{{text_label}}',
    font: 'bold italic 19px Comic Sans MS',
    rotate: false,
    scale: 0.9,
    // offset: [10, 20],
    color: '#2EFEC8',
    stroke: {
      color: '{{label_stroke_color}}',
      width: 10
    }
  }
});
let stylePolygon = new M.style.Polygon({
  'fill': {
    color: '#6A0888',
    opacity: 0.5
  },
  'stroke': {
    color: function(feature) {
      let id = feature.getProperties()["id"];
      let color = "red";
      if (id % 2 === 0) {
        color = "blue";
      }
      return color;
    },
    width: "{{stroke_width}}"
  },
  'label': {
    text: '{{label_text}}',
    font: 'bold italic 19px Comic Sans MS',
    rotate: false,
    scale: 0.9,
    // offset: [10, 20],
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


mapajs.addLayers([points, lines, polygons]);
let point = points.getFeatures()[0];
let line = lines.getFeatures()[0];
let polygon = polygons.getFeatures()[0];


function layerSetStyle(layer, style) {
  layer.setStyle(style);
}

function featureSetStyle(feature, style) {
  feature.setStyle(style);
}
