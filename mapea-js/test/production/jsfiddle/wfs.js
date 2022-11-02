// En el constructor
var mapajs = M.map({
  container: "map",
  controls: ["layerswitcher", "mouse"],
  wmcfiles: ["cdau"],
  center: [506039, 4134271],
  zoom: 8
});

// Capa WFS de Aguas Sup.
lAguasSupRediam = new M.layer.WFS({
  url: 'http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_WFS_RN_Aguas?bbox=508887.12101065,4131323.42844933,509462.159552335,4131744.12235486',
  legend: 'Cursos de Agua Rediam',
  name: 'a_red_hidrografica',
  geometry: 'MLINE'
}, {
  getFeatureOutputFormat: 'geojson',
  describeFeatureTypeOutputFormat: 'geojson'
});
//lAguasSupRediam.options.getFeatureOutputFormat = 'geojson';
mapajs.addLayers(lAguasSupRediam);

// Capa WFS de Unidades Litologicas
var lSuelo = new M.layer.WFS({
  url: 'http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_WFS_RN_Geodiversidad?bbox=508887.12101065,4131323.42844933,509462.159552335,4131744.12235486',
  legend: 'Unidades litológicas',
  name: 'unidades_litologicas_medio_terrestre',
  geometry: 'MPOLYGON'
}, {
  getFeatureOutputFormat: 'geojson',
  describeFeatureTypeOutputFormat: 'geojson'
});
//lSuelo.options.getFeatureOutputFormat = 'geojson';
mapajs.addWFS(lSuelo);
