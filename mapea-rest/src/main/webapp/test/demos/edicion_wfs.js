// Definimos el mapa
let mapajs = M.map({
  container: "mapjs",
  controls: ['mouse', 'layerswitcher', 'panzoombar'],
  layers: [new M.layer.WMTS({
    name: 'IGNBaseTodo',
    url: 'http://www.ign.es/wmts/ign-base?',
    transparent: false
  })],
  projection: 'EPSG:25830*m',
  center: [327829.1660345335, 4133007.047783969],
  zoom: 4
});

mapajs.addWFS('WFST*capa%20wfs*http://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero:prueba_pol_wfst*MPOLYGON');

mapajs.addPlugin(new M.plugin.WFSTControls(["drawfeature", "modifyfeature", "deletefeature"]))
