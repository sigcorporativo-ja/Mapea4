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
  name: "points",
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "alumnos": 400,
          "colegios": 2
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.383056640625,
          37.3002752813443
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 340,
          "colegios": 5
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.119384765624999,
          37.60552821745789
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 675,
          "colegios": 3
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.679931640625,
          37.43997405227057
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 440,
          "colegios": 2
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.0205078125,
          37.17782559332976
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 520,
          "colegios": 6
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.47119140625,
          37.84015683604136
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.2294921875,
          37.483576550426996
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 350,
          "colegios": 4
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.4931640625,
          37.07271048132943
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": "860",
          "colegios": 5
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -4.85595703125,
          37.67512527892127
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 150,
          "colegios": 1
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -4.954833984374999,
          37.3002752813443
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 320,
          "colegios": 8
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-7.3564988328828065, 37.678830777560634]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 575,
          "colegios": 3
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.11962890625,
          37.09023980307208
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 330,
          "colegios": 4
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.855712890625,
          36.97622678464096
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 360,
          "colegios": 6
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.39404296875,
          36.99377838872517
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 240,
          "colegios": 3
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.602783203124999,
          37.622933594900864
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 740,
          "colegios": 2
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.82275390625,
          37.900865092570065
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 500,
          "colegios": 1
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.756835937499999,
          36.721273880045004
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "alumnos": 210,
          "colegios": 4
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.3173828125,
          36.8708321556463
        ]
        }
    }
  ]
  }
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



// let stylePoint = new M.style.Point({
//   fill: {
//     color: 'red'
//   },
//   radius: 10
// });
//
// let stylePoint2 = new M.style.Point({
//   fill: {
//     color: 'red'
//   },
//   radius: 10
// });

// let style = new M.style.Point({
//   // stroke: {
//   //   color: 'black',
//   //   width: 15,
//   //   linedash: [1, 20],
//   //   linedashoffset: 60,
//   //   linecap: 'square',
//   //   linejoin: 'miter',
//   //   miterlimit: 15
//   // },
//   fill: {
//     color: 'red',
//     opacity: 0.5
//   },
//   // label: {
//   //   text: 'FEATURE',
//   //   font: 'bold italic 19px Comic Sans MS',
//   //   scale: 0.9,
//   //   offset: [10, 20],
//   //   color: '#2EFEC8',
//   //   stroke: {
//   //     color: 'blue',
//   //     width: 23,
//   //     linedash: [1, 20],
//   //     linedashoffset: 60,
//   //     linecap: 'square',
//   //     linejoin: 'miter',
//   //     miterlimit: 15
//   //   },
//   //   rotate: false,
//   //   rotation: 0.5,
//   //   align: M.style.align.RIGHT,
//   //   baseline: M.style.baseline.TOP
//   // },
//   radius: 43,
//   // icon: {
//   //   gradient: false,
//   form: M.style.form.TRIANGLE,
//   //   // class: "g-cartografia-alerta",
//   //   fontsize: 0.8,
//   //   radius: 20,
//   //   rotation: 0.2,
//   //   rotate: false,
//   //   offset: [20, 30],
//   //   color: 'blue',
//   //   fill: '#8A0829',
//   //   gradientcolor: 'black'
//   // }
// });

// let stylePoint4 = new M.style.Point({
//   fill: {
//     color: 'red'
//   },
//   radius: 10
// });
//
// let stylePoint5 = new M.style.Point({
//   radius: 10
// });
//
// let stylePoint6 = new M.style.Point({
//   fill: {
//     color: 'red',
//     opacity: 0.2
//   },
//   radius: 10
// });


// let styleLine = new M.style.Line({
//   'stroke': {
//     color: '{{stroke_color}}',
//     width: "{{stroke_width}}"
//   },
//   'fill': {
//     color: '{{fill_color}}',
//     opacity: "{{fill_op}}",
//     width: 6
//   },
//   'label': {
//     text: '{{text_label}}',
//     font: 'bold italic 19px Comic Sans MS',
//     rotate: false,
//     scale: 0.9,
//     // offset: [10, 20],
//     color: '#2EFEC8',
//     stroke: {
//       color: '{{label_stroke_color}}',
//       width: 10
//     }
//   }
// });
//
// let style = new M.style.Polygon({
//   label: {
//     text: 'FEATURE',
//     font: 'bold italic 19px Comic Sans MS',
//     rotate: false,
//     scale: 0.9,
//     offset: [10, 20],
//     color: '#2EFEC8',
//     stroke: {
//       color: '#C8FE2E',
//       width: 15,
//       linedash: [1, 20],
//       linedashoffset: 60,
//       linecap: 'square',
//       linejoin: 'bevel',
//       miterlimit: 15
//     },
//     rotation: 0.5,
//     align: M.style.align.RIGHT,
//     baseline: M.style.baseline.TOP
//   },
//   stroke: {
//     color: '#C8FE2E',
//     width: 15,
//     linedash: [1, 20],
//     linedashoffset: 60,
//     linecap: 'square',
//     linejoin: 'miter',
//     miterlimit: 15
//   },
//   fill: {
//     color: '#6A0888',
//     pattern: {
//       name: M.style.pattern.HATCH,
//       size: 6,
//       spacing: 20,
//       rotation: 3,
//       offset: [50, 30],
//       color: 'red',
//       opacity: 0.5,
//       scale: 2
//     }
//   }
// });
//
// let style = new M.style.Line({
//   fill: {
//     color: 'black',
//     opacity: 0.2,
//     width: 15
//   },
//   stroke: {
//     color: '#C8FE2E',
//     width: 50,
//     linedash: [1, 60],
//     linedashoffset: 60,
//     linecap: 'square',
//     linejoin: 'miter',
//     miterlimit: 15
//   }
// });
let choropleth = new M.style.Choropleth("alumnos", null, M.style.quantification.JENKS(3));
mapajs.addLayers([lines]);
// mapajs.addLayers([lines]);
// mapajs.addLayers([polygons]);
// let point = points.getFeatures()[0];
// let line = lines.getFeatures()[0];
// let polygon = polygons.getFeatures()[0];


function layerSetStyle(layer, style) {
  layer.setStyle(style);
}

function featureSetStyle(feature, style) {
  feature.setStyle(style);
}
