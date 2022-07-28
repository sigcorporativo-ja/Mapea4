//Creamos el mapa
var mapajs = M.map({
  container: "map"
});


mapajs.getMapImpl().on('click', function(e) {

  //Hacemos una peticón get con M.remote
  M.remote.get("http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR", {
    'SRS': mapajs.getProjection().code,
    'Coordenada_X': e.coordinate[0],
    'Coordenada_Y': e.coordinate[1]
  }).then(function(res) {
    console.log(res.text);
  });

  // Una peticion con POST
  let url = 'http://www.ieca.junta-andalucia.es/geoserver-ieca/topp/wfs?';
  let request = '<wfs:GetFeature service="WFS"  version="1.0.0"' +
    '  outputFormat="json"' +
    '  xmlns:topp="http://www.openplans.org/topp"' +
    ' xmlns:wfs="http://www.opengis.net/wfs"' +
    '  xmlns:ogc="http://www.opengis.net/ogc"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    '  xsi:schemaLocation="http://www.opengis.net/wfs' +
    '  http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">' +
    '<wfs:Query typeName="topp:andprov">' +
    '</wfs:Query>' +
    '</wfs:GetFeature>';

  M.remote.post(url, request).then(res => console.log(JSON.parse(res.text)));
});
