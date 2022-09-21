// En el constructor
let mapajs = M.map({
  container: "map",
  controls: ["layerswitcher", "mouse"],
  layers: ["OSM"],
  projection: "EPSG:3857*m",
  bbox: [-872530, 4288402, -150872, 4702896]
});

let geojson = new M.layer.GeoJSON({
  name: "Provincias GeoJSON",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json"
});

let selectedFeature;
let defaultStyle;
geojson.on(M.evt.LOAD, () => defaultStyle = geojson.getStyle());

let selectedStyle = new M.style.Polygon({
  fill: {
    color: 'pink',
    opacity: 0.5,
  },
  stroke: {
    color: '#FF0000',
    width: 2
  }
});

geojson.on(M.evt.SELECT_FEATURES, function(features, evt) {
  geojson.setStyle(defaultStyle, true);
  selectedFeature = features[0];
  selectedFeature.setStyle(selectedStyle);
  console.log('Seleccionado:', selectedFeature);
})

mapajs.addLayers([geojson]);

window.seleccionar = (evt) => {
  // Tomamos un feature cualquiera
  console.log(evt);
  selectedFeature = geojson.getFeatures()[0];
  if (selectedFeature) {
    console.log(selectedFeature);
    // selectedFeature.getCentroid() no es valido en este ejemplo, Multigeometría?
    mapajs.getFeatureHandler().selectFeatures([selectedFeature], geojson, { coord: [-253056, 4461347] });
    selectedFeature.setStyle(selectedStyle);
  }
};

window.deseleccionar = (evt) => {
  if (selectedFeature) {
    mapajs.getFeatureHandler().unselectFeatures([selectedFeature], geojson, {});
    mapajs.removePopup();
    geojson.setStyle(defaultStyle, true);
  }
};
