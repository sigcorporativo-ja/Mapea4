// constructor del mapa
let puntos = new M.layer.GeoJSON({
  'source': {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "styleType": 1
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.0651397705078125,
          37.34832607355296
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 1
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.076812744140625,
          37.43615762405059
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 1
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.8989715576171875,
          37.44433544620035
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 2
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.9937286376953125,
          37.40452830389465
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 2
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.968322753906249,
          37.35269280367274
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 2
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.9305572509765625,
          37.282248313909406
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 2
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.928497314453125,
          37.3319485736073
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 3
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.8412933349609375,
          37.34013777000893
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 3
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.9333038330078125,
          37.38107035775657
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {
          "styleType": 3
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.0239410400390625,
          37.48194191563765
        ]
        }
    }
  ]
  },
  'name': 'puntos'
});
let mapajs = M.map({
  container: "map",
  projection: "EPSG:4326*d",
  wmcfile: ["callejero"],
  layers: [puntos],
  // layers: ["OSM", puntos],
  center: {
    x: -5.9584180843195425,
    y: 37.36912689160224
  },
  zoom: 10,
  controls: ['layerswitcher', 'overviewmap'],
});

puntos.setFilter(M.filter.EQUAL('styleType', 1));
puntos.setStyle(new M.style.Point({
  stroke: {
    color: '#a80808',
    width: 2
  },
  fill: {
    color: '#ff3d3d',
    opacity: 0.1
  },
  radius: 15
}));

puntos.setFilter(M.filter.EQUAL('styleType', 2));
puntos.setStyle(new M.style.Point({
  stroke: {
    color: '#169940',
    width: 2
  },
  fill: {
    color: '#31ce63',
    opacity: 0.5
  }
}));

puntos.setFilter(M.filter.EQUAL('styleType', 3));
puntos.setStyle(new M.style.Point({
  stroke: {
    color: '#115bad',
    width: 2
  },
  fill: {
    color: '#317cce',
    opacity: 0.5
  }
}));

puntos.removeFilter();


puntos.getFeatures()[4].setStyle(new M.style.Point({
  stroke: {
    color: '#f759f7',
    width: 2
  },
  fill: {
    color: '#f759f7'
  },
  radius: 30
}));
