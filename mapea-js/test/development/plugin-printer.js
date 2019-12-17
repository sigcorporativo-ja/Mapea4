import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';

const mapjs = M.map({
  container: 'map',
});

mapjs.addLayers('WFST*CapaWFS*http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?*tematicos:Provincias*MPOLYGON')
const plugin = new WFSTControls(['drawfeature'])

// const plugin = new M.plugin.FreeDraw({});

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
