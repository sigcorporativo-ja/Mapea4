window.mapajs = M.map({
  "controls": ["mouse", "panzoombar", "panzoom", "navtoolbar", "layerswitcher", "overviewmap", "scale", "scaleline", "location"],
  "container": "map",
  "layers": ["OSM"],
  "projection": "EPSG:4326*d",
  "center": [-5.876766777086946, 37.376690849015695],
  "zoom": 9
});

let gj1 = new M.layer.GeoJSON({
  'url': 'http://127.0.0.1:8080/test/browser/prueba.geojson',
  'name': 'prueba1'
});
gj1.on(M.evt.SELECT_FEATURES, features => console.log('capa 1', features));
gj1.on(M.evt.UNSELECT_FEATURES, () => console.log('unselect 1'));

let gj2 = new M.layer.GeoJSON({
  'source': {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
          "foo": "bar",
          "foo2": 6,
          "ts": "par",
          "vendor": {
            "mapea": {
              "click": function() {
                window.alert('Hello World');
              }
            }
          }
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-6.0651397705078125,
            37.34832607355296
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "foo": "bar",
          "foo2": 1,
          "ts": "par"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-6.076812744140625,
            37.43615762405059
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "foo": "bar",
          "foo2": 1,
          "ts": "par"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-5.8989715576171875,
            37.44433544620035
          ]
        }
      }
    ]
  },
  'name': 'prueba2'
});
gj2.on(M.evt.SELECT_FEATURES, features => console.log('capa 2', features));
gj2.on(M.evt.UNSELECT_FEATURES, () => console.log('unselect 2'));

mapajs.addLayers([gj1, gj2]);
