var mapajs = M.map({
  container: "map",
  wmcfiles: ["mapa"]
});

//GeoJSON servido
let layer = new M.layer.GeoJSON({
  name: "Provincias",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json"
});

mapajs.addLayers(layer);

layer.on(M.evt.LOAD, function() {
  layer.getFeatures().forEach(function(feature) {
    console.log('\nId: ' + feature.getId());
    console.log('Provincia: ' + feature.getAttribute('nombre'));
  })
});
