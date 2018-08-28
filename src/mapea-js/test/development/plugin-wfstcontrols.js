import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';
import WFS from 'facade/js/layer/WFS';

const mapjs = M.map({
  container: 'map',
});

const plugin = new WFSTControls(['deletefeature', 'savefeature', 'drawfeature', 'editattribute']);

const wfs = new WFS({
  namespace: 'ggis',
  name: 'Colegios',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

// wfs.getFeatures().splice(1, 50);

mapjs.addLayers(wfs);
mapjs.addPlugin(plugin);

window.plugin = plugin;
window.layer = wfs;
