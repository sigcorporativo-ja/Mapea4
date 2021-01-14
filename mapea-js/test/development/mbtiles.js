import { map as Mmap } from 'M/mapea';
import MBTiles from 'M/layer/MBTiles';

const mapjs = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['layerswitcher', 'panzoom'],
  layers: ['OSM'],
  // bbox: [-734643.6701675085, 4803884.403272196, -576286.1226744428, 4882155.920236216]
});

fetch('./monfrague.mbtiles').then((response) => {
  const mbtile = new MBTiles({
    name: 'mbtile',
    legend: 'leyenda',
    source: response,
  });
  mapjs.addLayers(mbtile);
});
window.mapjs = mapjs;
