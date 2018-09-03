import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';
// import WFS from 'facade/js/layer/WFS';

const mapjs = M.map({
  container: 'map',
  wmcfiles: ['cdau'],
  layers: ['WFST*Campamentos*http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?*sepim:campamentos*MPOINT'],
});

const plugin = new WFSTControls(['deletefeature', 'savefeature', 'drawfeature', 'editattribute']);

// mapjs.addLayers(wfs);
mapjs.addPlugin(plugin);

window.plugin = plugin;
// window.layer = wfs;
