window.mapajs = M.map({
  "controls": ["mouse", "panzoombar", "panzoom", "navtoolbar", "layerswitcher", "overviewmap", "scale", "scaleline", "location"],
  "container": "map",
  "layers": ["OSM"],
  // "projection": "EPSG:23030*m",
  "projection": "EPSG:4326*d",
  "center": "-5.876766777086946,37.376690849015695",
  "zoom": 6
});


//=========================================================================
// GEOJSON ================================================================
//=========================================================================
function geojson_test() {
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
}

//=========================================================================
// CENTER =================================================================
//=========================================================================
function center_test() {
  mapajs.setCenter("-5.876766777086946,37.376690849015695*true").addLabel("<b>Popup de prueba<\/b><br>Funciona correctamente con tildes: camión áéíóú");
}
//=========================================================================
// KML ====================================================================
//=========================================================================
function kml_test() {
  let kml = new M.layer.KML('KML*Arboleda*http://sad.guadaltel.es/desarrollo/mapea/Componente/kml/*arbda_sing_se.kml*true');
  kml.on(M.evt.SELECT_FEATURES, features => console.log('capa kml', features));
  kml.on(M.evt.UNSELECT_FEATURES, () => console.log('unselect kml'));
  mapajs.addKML(kml);
}
//=========================================================================
// WFS ====================================================================
//=========================================================================
function wfs_test() {
  let wfs = new M.layer.WFS("WFST*capa wfs*http://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero:prueba_pol_wfst*MPOLYGON");
  wfs.on(M.evt.SELECT_FEATURES, features => console.log('capa wfs', features));
  wfs.on(M.evt.UNSELECT_FEATURES, () => console.log('unselect wfs'));
  mapajs.addWFS(wfs);
  mapajs.addPlugin(new M.plugin.WFSTControls(["drawfeature", "modifyfeature", "editattribute", "deletefeature"]));
}
//=========================================================================
// LOCATION ===============================================================
//=========================================================================
function location_test() {
  mapajs.addControls("location");
}
//=========================================================================
// GEOSEARCHBYLOCATION ====================================================
//=========================================================================
function geosearchbylocation_test() {
  mapajs.on(M.evt.COMPLETED, function(evt) {
    // mapajs.setProjection("EPSG:25830*m");
    mapajs.addPlugin(new M.plugin.Geosearchbylocation());
  }, this);
}
//=========================================================================
// GEOSEARCH ==============================================================
//=========================================================================
function geosearch_test() {
  mapajs.addPlugin(new M.plugin.Geosearch({}));
}
//=========================================================================
// SEARCHSTREET ===========================================================
//=========================================================================
function searchstreet_test() {
  mapajs.addPlugin(new M.plugin.Searchstreet({}));
}
//=========================================================================
// SEARCHSTREETGEOSEARCH ==================================================
//=========================================================================
function searchstreetgeosearch_test() {
  mapajs.addPlugin(new M.plugin.SearchstreetGeosearch({}));
}


geojson_test();
//kml_test();
//wfs_test();
location_test();
//geosearch_test();
geosearchbylocation_test();
//earchstreet_test();
center_test();
searchstreetgeosearch_test();
