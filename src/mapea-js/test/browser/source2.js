let mapajs = M.map({
  container: "map",
  wmcfile: "callejero",
  controls: ["mouse", "layerswitcher", ]
});

var feature2 = new M.Feature("featurePrueba002", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
             [
               [263770.72265536943, 4085361.4590256726],
               [230910.00600234355, 4031901.3328427672],
               [288293.77947248437, 4017678.0840030923],
               [263770.72265536943, 4085361.4590256726]
             ]
           ]
  },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
    "cod_ine_provincia": "-",
    "area": 1234,
    "perimetro": 345,
    "cod_ine_comunidad": "-",
    "nombre": "feature2",
    "nom_provincia": "Cádiz",
    "alias": "f2",
    "nom_ccaa": "Andalucía"
  }
});

var geometry1 = {
  "type": "MultiPolygon",
  "coordinates": [
           [
             [
               [217015, 4101798],
               [261647, 4047356],
               [337669, 4118964],
               [217015, 4101798]
             ]
           ]
         ]
};
/*
var capaGeoJSON = new M.layer.GeoJSON({
  source: {
    "crs": {
      "properties": {
        "name": "EPSG:23030" //"EPSG:25830"
      },
      "type": "name"
    },
    "features": [feature2.getGeoJSON()],
    //"features": [],
    "type": "FeatureCollection"
  },
  name: 'prueba'
});
*/
var capaGeoJSON = new M.layer.Vector({
  name: 'prueba'
});

mapajs.addLayers(capaGeoJSON);
capaGeoJSON.addFeatures(feature2);


// capaGeoJSON.addFeatures(feature2);
// capaGeoJSON.redraw();
// setTimeout(() => capaGeoJSON.addFeatures(feature2), 1000);


console.log("hola");

// mapajs.addPlugin(new M.plugin.AttributeTable({
//   "pages": "10"
// }));



function cambiarGeometry1() {
  //capaGeoJSON.addFeatures([feature2,feature3]);
  //console.log('Cambiando geometría al feature2....');
  //console.log('Geometría anterior: ');
  //console.log(feature2.getGeometry());
  //console.log(capaGeoJSON.getFeatures()[0].getGeometry());

  feature2.setGeometry(geometry1);

  //console.log('Geometría nueva: ');
  //console.log(feature2.getGeometry());
  //console.log(capaGeoJSON.getFeatures()[0].getGeometry());
  //mapajs.refresh();
  //capaGeoJSON.refresh();
  //feature2.setAttribute({"nombre":"feture2_modif"});
  //capaGeoJSON.addFeatures([feature2]);

  //capaGeoJSON.redraw();

  //mapajs.refresh();
}

function cambiarGeometry2() {
  capaGeoJSON.getFeatures()[0].setGeometry(geometry1);
  //capaGeoJSON.redraw();
  //mapajs.refresh();
}
