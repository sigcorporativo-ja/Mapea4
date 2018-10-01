import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';

const mapjs = M.map({
  container: 'map',
  wmcfiles: ['cdau'],
  layers: ['WFST*capa_wfs*http://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero:prueba_pun_wfst*POINT'],
});

const plugin = new WFSTControls(['deletefeature', 'savefeature', 'drawfeature', 'editattribute']);
mapjs.addPlugin(plugin);

window.plugin = plugin;
window.mapjs = mapjs;
