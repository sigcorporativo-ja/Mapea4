import { map as Mmap } from 'M/mapea';
import MBTiles from 'M/layer/MBTiles'; // Reemplazado con "M.layer.MBTiles" da error de "M.layer is undefined"

const mapjs = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['layerswitcher', 'panzoom'],
  layers: ['OSM'],
  // bbox: [-734643.6701675085, 4803884.403272196, -576286.1226744428, 4882155.920236216]
});

// En esta url se pueden descargar ficheros mbtiles: https://centrodedescargas.cnig.es/CentroDescargas/loadMapMovExt
fetch('./monfrague.mbtiles').then((response) => {
  const mbtile = new MBTiles({
    name: 'mbtile',
    legend: 'leyenda',
    source: response,
  });
  mapjs.addLayers(mbtile);
});
window.mapjs = mapjs;
