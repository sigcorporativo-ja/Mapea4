let map = M.map({
  container: 'map',
  controls: ['layerswitcher']
});
const layer = new M.layer.GeoJSON({
  name: "Provincias",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json"
});

map.addLayers([layer, 'KML*Arboleda*http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml*true']);
