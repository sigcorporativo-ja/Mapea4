import AttributeTable from 'plugins/attributetable/facade/js/attributetable';
import WFS from 'M/layer/WFS';

const mapjs = M.map({
  container: 'map',
});

const plugin = new AttributeTable({});

const wfs = new WFS({
  namespace: 'ggis',
  name: 'Colegios',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers(wfs);
mapjs.addPlugin(plugin);
window.wfs = wfs;
window.plugin = plugin;
