import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleLine from 'M/style/Line';

const mapjs = Mmap({
  controls: ['layerswitcher'],
  container: 'map',
  layers: ['OSM'],
});

const styleline = new StyleLine({
  fill: {
    color: 'red',
  },
  stroke: {
    color: 'black',
    width: 3,
  },
  label: {
    path: true,
    text: 'Texto',
    font: '16px serif',
    mindwidth: 30,
    textoverflow: '',
  },
});

const wfs = new WFS({
  namespace: 'mapea',
  name: 'hs1_100_simplificada',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers(wfs);
wfs.setStyle(styleline);
window.mapjs = mapjs;
