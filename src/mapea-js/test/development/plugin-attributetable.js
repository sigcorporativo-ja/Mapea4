import AttributeTable from 'plugins/attributetable/facade/js/attributetable';

const mapjs = M.map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new AttributeTable({});

const wfs = new M.layer.WFS({
  namespace: 'ggis',
  name: 'Colegios',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});
mapjs.addLayers(wfs);

mapjs.addPlugin(plugin);
