var mapajs = M.map({
  container: "map"
});

//Ejemplo de eventos asociados al mapa y a las capas 
mapajs.on(M.evt.ADDED_LAYER, function() {
  console.log('Evento M.evt.ADDED_LAYER: se ha añadido una capa al mapa');
});

mapajs.on(M.evt.ADDED_WFS, function() {
  console.log('Evento M.evt.ADDED_WFS: se ha añadido una capa WFS');
});

mapajs.on(M.evt.ADDED_WMS, function() {
  console.log('Evento M.evt.ADDED_WMS: se ha añadido una capa WMS');
});

var wfslayer = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
  namespace: 'sepim',
  name: 'campamentos',
  geometry: 'POINT'
});
mapajs.addWFS(wfslayer);

mapajs.addWMS(new M.layer.WMS({
  url: 'http://www.idejaen.es/wms?',
  name: 'ESTABLECIMIENTOS_COMERCIALES',
  legend: 'Establecimientos'
}));

wfslayer.on(M.evt.LOAD, function() {
  console.log("Evento M.evt.LOAD: se ha cargado la capa WFS en el mapa");
});

mapajs.on(M.evt.CLICK, function(e) {
  alert("Click en " + e.coord);
});
