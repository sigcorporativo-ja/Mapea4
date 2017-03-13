//1

// window.mapajs = M.map({
//   "controls": ['navtoolbar', 'panzoombar', 'scale', 'scaleline', 'mouse', 'layerswitcher', 'location'],
//   "wmcfiles": ['http://www.callejerodeandalucia.es/wmc/context_cdau_callejero.xml*Callejero', 'http://www.callejerodeandalucia.es/wmc/context_cdau_satelite.xml*Satélite', 'http://www.callejerodeandalucia.es/wmc/context_cdau_hibrido.xml*Híbrido'],
//   "container": "map",
//   "projection": "EPSG:25830*m",
//   "getfeatureinfo": "html",
//   //"maxextent": [96388.1179, 3959795.9442, 621889.937, 4299792.107],
//   //"maxextent": [91798.20752380951, 4157785.74141, 592276.1304761905, 4514781.71235],
//   "maxextent": [45242.01358204, 3928703.7510908, 673036.04131796, 4330884.3001092],
//   //"resolutions": [490.4640841686878, 296.4735539465016, 179.21101876124024]
//   //"resolutions": [490.4640841686878, 296.4735539465016, 179.21101876124024, 108.32868165784868, 65.48204095286125, 39.58229364311229, 23.92652927811816, 14.463002282240476, 8.742531463073329, 5.284646637764822, 3.194439757408831, 1.9309607743291293, 1.167218603309086, 0.7055551236581433, 0.4264908313738002, 0.25780328587628126]
// });
window.mapajs = M.map({
  container: 'map',
  controls: ['scale', 'location', 'layerswitcher', 'mouse', 'getfeatureinfo', 'panzoombar'],
  wmcfiles: ['http://localhost:8080/mapea/files/wmc/context_cdau_callejero.xml*Callejero',
    'http://localhost:8080/mapea/files/wmc/context_cdau_satelite.xml*Satélite',
    'http://localhost:8080/mapea/files/wmc/context_cdau_hibrido.xml*Híbrido'],
  resolutions: [490.4640841686878, 296.4735539465016, 179.21101876124024, 108.32868165784868, 65.48204095286125, 39.58229364311229, 23.92652927811816, 14.463002282240476, 8.742531463073329, 5.284646637764822, 3.194439757408831, 1.9309607743291293, 1.167218603309086, 0.7055551236581433, 0.4264908313738002, 0.25780328587628126],
  //maxExtent: [48077, 3942489, 669985, 4316713],
  projection: 'EPSG:25830*m'
});

// var mapajs = M.map({
//   container: "map",
//   layers: ["WMS*MTA*http://www.ideandalucia.es/wms/mta400r_2008?*MTA400*false"],
//   controls: ["mouse", "layerswitcher"],
//   maxextent: [323020, 4126873, 374759, 4152013]
// });

/** Zoom **/
function hacerZoom() {
  mapajs.setZoom(6);
}

/** Bbox **/
function setCobertura() {
  mapajs.setBbox([323020, 4126873, 374759, 4152013]);
}

/** MaxExtent **/
function setMaxCobertura() {
  mapajs.setMaxExtent([323020, 4126873, 374759, 4152013]);
}

/** Projection **/
function setProyeccion() {
  mapajs.setProjection("EPSG:4326*d");
}

/** Center **/
function setCentro() {
  //modo objeto
  mapajs.setCenter({
    x: 211000,
    y: 4040000,
    draw: true
  });
  //modo cadena
  //mapajs.setCenter("211000,4040000*true");
}

/** Etiqueta **/
function addEtiqueta() {
  mapajs.addLabel("texto <b>con html</b>", [211000, 4040000]);
  //mapajs.addLabel("texto <b>con html</b>"); //se añade en el centro establecido
}

let funcs = ['hacerZoom', 'setCobertura', 'setMaxCobertura', 'setCentro', 'addEtiqueta', 'setProyeccion'];
//let funcs = ['hacerZoom', 'setProyeccion'];

var timeout = 3000;
funcs.forEach((function (func, i) {
  setTimeout(function () {
    console.log('running ' + func + '()');
    //window[func]();
  }, timeout * i);
}))

mapajs.addPlugin(new M.plugin.Measurebar());
