var map = M.map({
  container: 'map',
  controls: ["layerswitcher"]
});

/*const wfs = new M.layer.GeoJSON({
name: 'Radio',
url: 'https://www.ideandalucia.es/services/DERA_g9_transport_com/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g9_transport_com%3Ag09_27_AntenaRadio&outputFormat=json&srsname=EPSG%3A25830'
});*/

const wfs = new M.layer.GeoJSON({
name: 'Campamentos',
url: 'https://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typename=sepim%3Acampamentos&outputFormat=application%2Fjson&srsname=EPSG%3A25830'
});

/*const wfs = new M.layer.GeoJSON({
name: 'Aguas subterráneas',
url: 'https://www.cma.junta-andalucia.es/medioambiente/mapwms/REDIAM_WFS_RN_Aguas?language=spa&SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=ms:b_hidrogeo_puntos&TYPENAME=ms:b_hidrogeo_puntos&STARTINDEX=0&COUNT=5000&SRSNAME=urn:ogc:def:crs:EPSG::25830&OUTPUTFORMAT=application/json;%20subtype=geojson'
});
*/

// 'telefono' para Campamentos
// 'frecuencia' para Radio
// 'X_ETRS89' para Aguas
map.addLayers([wfs]);
const styleheatmap = new M.style.Heatmap('telefono', {
blur: 20,
radius: 15,
gradient: ['red', 'black', 'blue', 'pink', 'green', 'white'],
});
wfs.setStyle(styleheatmap);
