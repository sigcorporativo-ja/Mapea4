// ==========================================================================
// =============== Test styleproportional con capa local ==================
// ==========================================================================

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

let stylePoint = new M.style.Point({});
let stylePoint2 = new M.style.Point({
  fill: {
    color: 'red',
    opacity: 0.6
  },
  stroke: {
    color: 'blue'
  }
});

let stylePoint3 = new M.style.Point({
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




let proportional = new M.style.Proportional('alumnos', 4, 20);
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
mapajs.addLayers([points]);
// points.setStyle(proportional);
function setProportional(stylePoint, styleProportional) {
  styleProportional.setStyle(stylePoint);
}

function setMinRadio(element, style) {
  style.setMinRadius(parseInt(element.value));
}

function setMaxRadio(element, style) {
  style.setMaxRadius(parseInt(element.value));
}
