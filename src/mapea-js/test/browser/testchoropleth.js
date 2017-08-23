//=============================================================================
//==================== TESTS DE M.style.Choropleth ============================
//========================   PARA CAPAS LOCALES   =============================
//=============================================================================

//================== RESUMEN DE DE LOS TEST ===================================
// 1. Aplicar estilo choropleth con estilos nulos y con cuantificador pasado por párametro
// a capa de puntos.(jenks, quantile)

// 2. Aplicar estilo choropleth con estilos nulos y con cuantificador pasado por párametro
// a capa de lineas (jenks, quantile)

// 3. Aplicar estilo choropleth con estilos nulos y con cuantificador pasado por párametro
// a capa de poligonos. (jenks, quantile)

// Nota: No se contempla la posibilidad de que puedan mezclarse features en una capa
// con diferentes geometryTypes y aplicársele un M.style.Choropleth. El usuario
// debe encargarse de esta restricción

// 4. Aplicar estilo choropleth con estilos definidos por el usuario
// y con cuantificador pasado por párametro a capa de puntos. (jenks, quantile)

// 5. Aplicar estilo choropleth con estilos definidos por el usuario
// y con cuantificador pasado por párametro a capa de lineas. (jenks, quantile)

// 6. Aplicar estilo choropleth con estilos definidos por el usuario
// y con cuantificador pasado por párametro a capa de poligonos. (jenks, quantile)

// 7. Setear nuevos estilos de features a un M.style.Choropleth ya aplicado a una capa
// de puntos. (hace uso del quantification que ya tenia choropleth)

// 8. Setear nuevos estilos de features a un M.style.Choropleth ya aplicado a una capa
// de lineas. (hace uso del quantification que ya tenia choropleth)

// 9. Setear nuevos estilos de features a un M.style.Choropleth ya aplicado a una capa
// de poligonos. (hace uso del quantification que ya tenia choropleth)

// 10. Setear nuevo quantification a un M.style.Choropleth ya aplicado a una capa
// de puntos (se hace uso de los estilos que ya tenia anteriormente Choropleth)

// 11. Setear nuevo quantification a un M.style.Choropleth ya aplicado a una capa
// de lineas (se hace uso de los estilos que ya tenia anteriormente Choropleth)

// 12. Setear nuevo quantification a un M.style.Choropleth ya aplicado a una capa
// de poligonos (se hace uso de los estilos que ya tenia anteriormente Choropleth)

// Nota: En los test de setQuantification también se está comprobando que
// M.style.Choroplet funciona con cuantificadores definidos por usuario ademas
// de los predeterminados de M.style.quantification.

// 13. Setear nuevo attributeName a un M.style.Choropleth ya aplicado a una capa
// de puntos (se hace uso de los estilos y quantification que ya tenia anteriormente Choropleth).
// Esta función en principio debe cambiar los colores de la capa, ya que estamos usando un campo
// diferente para cuantificar. Solo se hace en capa de puntos, en lineas y poligonos es análogo.

// 14. Tests de todos los getters que tiene M.style.Choropleth. Estos getters devolverán
// la información por la consola del navegador.

//==============================================================================
//==============================================================================
let mapajs = M.map({
  container: "map",
  projection: "EPSG:4326*m",
  layers: ["OSM"],
  center: [
    -6.39404296875,
    36.99377838872517
  ],
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
          "coordinates": [
          -4.713134765624999,
          37.448696585910376
        ]
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
let polygons = new M.layer.GeoJSON({
  name: "polygons",
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "olivos": 450
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -6.229248046875,
              38.05674222065296
            ],
            [
              -6.5478515625,
              37.735969208590504
            ],
            [
              -5.921630859375,
              37.59682400108367
            ],
            [
              -6.229248046875,
              38.05674222065296
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 1300
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -4.229736328124999,
              38.16047628099622
            ],
            [
              -3.6694335937500004,
              38.20365531807149
            ],
            [
              -4.119873046875,
              38.565347844885466
            ],
            [
              -4.9658203125,
              38.42777351132902
            ],
            [
              -4.9658203125,
              37.735969208590504
            ],
            [
              -4.229736328124999,
              38.16047628099622
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 790
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -4.04296875,
              37.65773212628272
            ],
            [
              -4.998779296875,
              37.32648861334206
            ],
            [
              -4.7900390625,
              36.8708321556463
            ],
            [
              -4.075927734375,
              37.15156050223665
            ],
            [
              -3.438720703125,
              37.16907157713011
            ],
            [
              -4.04296875,
              37.65773212628272
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 880
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -2.79052734375,
              38.25543637637947
            ],
            [
              -3.2299804687499996,
              37.83148014503288
            ],
            [
              -2.96630859375,
              37.23032838760387
            ],
            [
              -2.735595703125,
              37.22158045838649
            ],
            [
              -2.406005859375,
              37.03763967977139
            ],
            [
              -2.79052734375,
              38.25543637637947
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 270
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -5.6634521484375,
              38.55246141354153
            ],
            [
              -6.7181396484375,
              38.53527591154413
            ],
            [
              -5.745849609375,
              38.03078569382294
            ],
            [
              -5.3997802734375,
              38.33734763569314
            ],
            [
              -5.053710937499999,
              38.79690830348427
            ],
            [
              -5.6634521484375,
              38.55246141354153
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 550
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -2.63671875,
              39.2832938689385
            ],
            [
              -2.0654296875,
              39.5633531658293
            ],
            [
              -4.647216796875,
              40.59727063442024
            ],
            [
              -5.09765625,
              40.17887331434696
            ],
            [
              -2.63671875,
              39.2832938689385
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 775
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -1.64794921875,
              39.00211029922515
            ],
            [
              -2.96630859375,
              38.89958342598271
            ],
            [
              -1.549072265625,
              38.20365531807149
            ],
            [
              -0.9558105468749999,
              39.06184913429154
            ],
            [
              -1.318359375,
              39.884450178234395
            ],
            [
              -1.64794921875,
              39.00211029922515
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 950
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -5.592041015625,
              39.73253798438173
            ],
            [
              -6.52587890625,
              39.54641191968671
            ],
            [
              -6.580810546874999,
              38.8824811975508
            ],
            [
              -6.075439453125,
              38.676933444637925
            ],
            [
              -5.11962890625,
              38.96795115401593
            ],
            [
              -4.779052734375,
              39.42770738465604
            ],
            [
              -5.592041015625,
              39.73253798438173
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 445
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -5.592041015625,
              41.22824901518529
            ],
            [
              -6.448974609375,
              40.38839687388361
            ],
            [
              -5.635986328124999,
              39.842286020743394
            ],
            [
              -4.954833984374999,
              40.9964840143779
            ],
            [
              -4.76806640625,
              41.73033005046653
            ],
            [
              -3.7243652343749996,
              41.32732632036622
            ],
            [
              -4.6142578125,
              42.00032514831621
            ],
            [
              -5.592041015625,
              41.22824901518529
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 770
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -0.63720703125,
              40.730608477796636
            ],
            [
              -0.41748046875,
              40.111688665595956
            ],
            [
              -0.10986328125,
              40.58058466412761
            ],
            [
              -0.63720703125,
              40.730608477796636
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 630
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -1.8017578124999998,
              41.393294288784865
            ],
            [
              -3.18603515625,
              40.94671366508002
            ],
            [
              -1.9555664062500002,
              40.16208338164617
            ],
            [
              -1.8017578124999998,
              41.393294288784865
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 520
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -1.669921875,
              41.88592102814744
            ],
            [
              -2.197265625,
              42.76314586689492
            ],
            [
              -4.658203125,
              43.068887774169625
            ],
            [
              -3.97705078125,
              42.261049162113856
            ],
            [
              -1.669921875,
              41.88592102814744
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 364
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -6.328125,
              42.87596410238256
            ],
            [
              -7.55859375,
              42.58544425738491
            ],
            [
              -6.767578125,
              42.09822241118974
            ],
            [
              -6.328125,
              42.87596410238256
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 205
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -7.3828125,
              40.91351257612758
            ],
            [
              -8.28369140625,
              40.43022363450862
            ],
            [
              -8.3056640625,
              38.87392853923629
            ],
            [
              -7.3828125,
              40.91351257612758
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 404
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -0.1318359375,
              42.049292638686836
            ],
            [
              -1.0546875,
              41.82045509614034
            ],
            [
              -1.12060546875,
              41.393294288784865
            ],
            [
              -0.68115234375,
              41.21172151054787
            ],
            [
              -0.263671875,
              41.45919537950706
            ],
            [
              -0.15380859375,
              41.983994270935625
            ],
            [
              -0.1318359375,
              42.049292638686836
            ]
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "olivos": 250
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          [
            [
              -5.73486328125,
              36.932330061503144
            ],
            [
              -6.1962890625,
              36.686041276581925
            ],
            [
              -5.69091796875,
              36.06686213257888
            ],
            [
              -5.4052734375,
              36.29741818650811
            ],
            [
              -5.73486328125,
              36.932330061503144
            ]
          ]
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
        "properties": {
          "casas": 95
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -6.52587890625,
            37.57070524233116
          ],
          [
            -5.723876953125,
            37.96152331396614
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 77
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -6.1248779296875,
            37.41816326969145
          ],
          [
            -5.69091796875,
            37.57505900514996
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 35
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.394287109375,
            37.71859032558816
          ],
          [
            -5.20751953125,
            37.309014074275915
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 69
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.9490966796875,
            36.932330061503144
          ],
          [
            -5.679931640625,
            37.31775185163688
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 82
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -4.9603271484375,
            37.91820111976663
          ],
          [
            -4.7845458984375,
            37.496652341233364
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 54
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.185546875,
            37.965854128749434
          ],
          [
            -4.9383544921875,
            37.12090636165327
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 54
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.38330078125,
            38.212288054388175
          ],
          [
            -4.2681884765625,
            37.931200459333716
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 102
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -4.5977783203125,
            37.69251435532741
          ],
          [
            -4.68017578125,
            37.87051721701939
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 65
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -4.6636962890625,
            37.12966595484084
          ],
          [
            -5.328369140625,
            36.83566824724438
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 46
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.4437255859375,
            37.13404537126446
          ],
          [
            -4.8394775390625,
            36.84006462037767
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 76
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -4.141845703125,
            37.28716518793858
          ],
          [
            -4.1802978515625,
            37.844494798834575
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 27
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -3.9825439453125,
            37.53150992479082
          ],
          [
            -5.5810546875,
            37.94419750075404
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 58
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -6.542358398437499,
            37.391981943533544
          ],
          [
            -6.1358642578125,
            37.58811876638322
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 75
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -6.9598388671875,
            37.70555348721583
          ],
          [
            -6.3116455078125,
            36.721273880045004
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 90
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -6.7950439453125,
            37.83148014503288
          ],
          [
            -6.2677001953125,
            36.96744946416934
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 34
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -6.4764404296875,
            37.87918931481653
          ],
          [
            -5.482177734375,
            38.24249456800328
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 65
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -3.8946533203125,
            37.78808138412046
          ],
          [
            -3.8067626953124996,
            37.155938651244625
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 70
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -4.46044921875,
            38.302869955150044
          ],
          [
            -5.6195068359375,
            36.84006462037767
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 50
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.8282470703125,
            36.61111838494165
          ],
          [
            -5.4547119140625,
            36.65079252503471
          ]
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "casas": 40
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
          [
            -5.817260742187499,
            36.474306755095235
          ],
          [
            -5.4547119140625,
            36.53612263184686
          ]
        ]
        }
    }
  ]
  }
});

mapajs.addLayers(points);
mapajs.addLayers(polygons);
mapajs.addLayers(lines);

//====================================================================
// Choropleth con styles por defecto segun el cuantificador
//====================================================================

let jenks = M.style.quantification.JENKS;
let quantile = M.style.quantification.QUANTILE;

function points_jenks() {
  let choropleth = new M.style.Choropleth("alumnos", null, jenks(numClass()));
  points.setStyle(choropleth);
}

function points_quantile() {
  let choropleth = new M.style.Choropleth("alumnos", null, quantile(numClass()));
  points.setStyle(choropleth);
}

function lines_jenks() {
  let choropleth = new M.style.Choropleth("casas", null, jenks(numClass()));
  lines.setStyle(choropleth);
}

function lines_quantile() {
  let choropleth = new M.style.Choropleth("casas", null, quantile(numClass()));
  lines.setStyle(choropleth);
}

function polygons_jenks() {
  let choropleth = new M.style.Choropleth("olivos", null, jenks(numClass()));
  polygons.setStyle(choropleth);
}

function polygons_quantile() {
  let choropleth = new M.style.Choropleth("olivos", null, quantile(numClass()));
  polygons.setStyle(choropleth);
}

//========================================================================
// Choropleth con styles introducidos por parametros
//========================================================================

function points_jenks2() {
  let stylesPoint = [
      new M.style.Point({
      fill: {
        color: '33BBFF'
      },
      radius: 5
    }),
    new M.style.Point({
      fill: {
        color: '#FF0099'
      },
      radius: 6
    }),
    new M.style.Point({
      fill: {
        color: '#00AAAA'
      },
      radius: 7
    })
  ];
  let choropleth = new M.style.Choropleth("alumnos", stylesPoint, M.style.quantification.JENKS()); //M.style.quantification.JENKS() --> f(d, l = 6) --> f(d, 2)
  points.setStyle(choropleth);
}

function points_quantile2() {
  let stylesPoint = [
      new M.style.Point({
      fill: {
        color: '33BBFF'
      },
      radius: 5
    }),
    new M.style.Point({
      fill: {
        color: '#FF0099'
      },
      radius: 6
    }),
    new M.style.Point({
      fill: {
        color: '#00AAAA'
      },
      radius: 7
    })
  ];
  let choropleth = new M.style.Choropleth("alumnos", stylesPoint, M.style.quantification.QUANTILE());
  points.setStyle(choropleth);
}

function polygons_jenks2() {
  let stylesPolygon = [
      new M.style.Polygon({
      fill: {
        color: '#AA00FF'
      },
      radius: 5
    }),
    new M.style.Polygon({
      fill: {
        color: '#00FF33'
      },
      radius: 6
    }),
    new M.style.Polygon({
      fill: {
        color: '#000000'
      },
      radius: 7
    })
  ];
  let choropleth = new M.style.Choropleth("olivos", stylesPolygon, M.style.quantification.JENKS());
  polygons.setStyle(choropleth);
}

function polygons_quantile2() {
  let stylesPolygon = [
      new M.style.Polygon({
      fill: {
        color: '#AA00FF'
      },
      radius: 5
    }),
    new M.style.Polygon({
      fill: {
        color: '#00FF33'
      },
      radius: 6
    }),
    new M.style.Polygon({
      fill: {
        color: '#000000'
      },
      radius: 7
    })
  ];
  let choropleth = new M.style.Choropleth("olivos", stylesPolygon, M.style.quantification.QUANTILE());
  polygons.setStyle(choropleth);
}

function lines_jenks2() {
  let stylesLine = [
      new M.style.Line({
      fill: {
        color: '33BBFF'
      }
    }),
    new M.style.Line({
      fill: {
        color: '#FF0099'
      }
    }),
    new M.style.Line({
      fill: {
        color: '#00AAAA'
      }
    })
  ];
  let choropleth = new M.style.Choropleth("casas", stylesLine, M.style.quantification.JENKS()); //M.style.quantification.JENKS() --> f(d, l = 6) --> f(d, 2)
  lines.setStyle(choropleth);
}

function lines_quantile2() {
  let stylesLine = [
      new M.style.Line({
      fill: {
        color: '33BBFF'
      }
    }),
    new M.style.Line({
      fill: {
        color: '#FF0099'
      }
    }),
    new M.style.Line({
      fill: {
        color: '#00AAAA'
      }
    })
  ];
  let choropleth = new M.style.Choropleth("casas", stylesLine, M.style.quantification.QUANTILE());
  lines.setStyle(choropleth);
}


// ==============================================================================================
// === Test de choropleth para comprobar que se le puede setear estilos definidos por usuario
// === a un estilo ya asignado a una capa y se refresca el estilo
// ==============================================================================================
function points_setStyles() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    let styles = [
      new M.style.Point({
        fill: {
          color: 'blue'
        },
        radius: 5
      }),
      new M.style.Point({
        fill: {
          color: 'red'
        },
        radius: 8
      }),
      new M.style.Point({
        fill: {
          color: 'green'
        },
        radius: 10
      }),
      new M.style.Point({
        fill: {
          color: 'pink'
        },
        radius: 12
      })
    ];
    choropleth.setStyles(styles);
  }
}

function lines_setStyles() {
  let choropleth = lines.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    let styles = [
      new M.style.Line({
        fill: {
          color: 'purple'
        }
      }),
      new M.style.Line({
        fill: {
          color: 'orange'
        }
      }),
      new M.style.Line({
        fill: {
          color: 'yellow'
        }
      })
    ];
    choropleth.setStyles(styles);
  }
}

function polygons_setStyles() {
  let choropleth = polygons.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    let styles = [
      new M.style.Polygon({
        fill: {
          color: 'purple'
        }
      }),
      new M.style.Polygon({
        fill: {
          color: 'orange'
        }
      }),
      new M.style.Polygon({
        fill: {
          color: 'yellow'
        }
      }),
      new M.style.Polygon({
        fill: {
          color: 'brown'
        }
      })
    ];
    choropleth.setStyles(styles);
  }
}

// ===========================================================================
// Test de choropleth para comprobar que se le puede setear un cuantificador
// a un estilo ya asignado a una capa y se refresca el estilo
// ===========================================================================

function points_setQuantification() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    let quantification = function() {
      return [300, 450, 600, 900];
    };
    choropleth.setQuantification(quantification);
  }
}

function lines_setQuantification() {
  let choropleth = lines.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    let quantification = function() {
      return [40, 60, 80, 100];
    };
    choropleth.setQuantification(quantification);
  }
}

function polygons_setQuantification() {
  let choropleth = polygons.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    let quantification = function() {
      return [300, 500, 800, 1000, 1200];
    };
    choropleth.setQuantification(quantification);
  }
}

// ==============================================================================
// Test para comprobar que al cambiar el atributo sobre el que realizar
// el choropleth map sobre un estilo choropleth ya asignado, el estilo se refresca
// ============================================================================


function points_setAttributeName(attributeName) {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    choropleth.setAttributeName(attributeName);
  }
}

//==============================================================================
//============================= GETTERS ========================================
//==============================================================================
function getAttributeName() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    console.log(choropleth.getAttributeName());
  }
  else {
    console.log('No hay M.style.Choropleth asignado');
  }
}

function getStyles() {
  let choropleth = polygons.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    console.log(choropleth.getStyles());
  }
  else {
    console.log('No hay M.style.Choropleth asignado');
  }
}

function getQuantification() {
  let choropleth = lines.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    console.log(choropleth.getQuantification());
  }
  else {
    console.log('No hay M.style.Choropleth asignado');
  }
}

function getValues() {
  let choropleth = polygons.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    console.log(choropleth.getValues());
  }
  else {
    console.log('No hay M.style.Choropleth asignado');
  }
}


//=============================================================================
// TEST Choropleth-Cluster ====================================================
// ============================================================================

function choropleth_cluster() {
  let options = {
    ranges: [
      ],
    animated: true,
    hoverInteraction: true,
    displayAmount: true,
    selectedInteraction: true,
    distance: 40
  };

  let optionsVendor = {
    displayInLayerSwitcherHoverLayer: false,
    distanceSelectFeatures: 15
  }
  let cluster = new M.style.Cluster(options, optionsVendor);
  let choropleth = new M.style.Choropleth('alumnos', null, M.style.quantification.JENKS(3));
  points.setStyle(choropleth);
  points.setStyle(cluster);
}




// Funcion auxiliar para ocultar las capas deseadas
function toogle_layer(layer) {
  let visible = layer.isVisible();
  layer.setVisible(!visible);
}

// Función auxiliar para recoger el numero de clases del input number
function numClass() {
  let numClases = document.getElementById('clases').value;
  numClases = numClases === "" ? 0 : parseInt(numClases);
  return numClases;
}
