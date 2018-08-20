import AttributeTable from 'plugins/attributetable/facade/js/attributetable';
import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';

const mapjs = map({
  controls: ['layerswitcher'],
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
