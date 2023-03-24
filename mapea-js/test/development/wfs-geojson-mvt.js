import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import GeoJSON from 'M/layer/GeoJSON';
import MVT from 'M/layer/MVT';
import LayerGroup from 'M/layer/LayerGroup';


const mapjs = Mmap({
  container: 'map',
  controls: ['layerswitcher'],
  projection: 'EPSG:3857*m',
  layers: ['OSM'],
  //bbox: [-998230.9872854212, 4316600.505522167, 215803.1745700189, 4636952.283813728]
});

// const provincias = new WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Provincias',
//   geometry: 'MPOLYGON',
//   ids: '3,4',
// });

// const municipios = new GeoJSON({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=50&outputFormat=application%2Fjson',
//   name: 'Municipios',
// });


document.getElementById('change-CDAU').addEventListener('click', () => {
  const allLayers = mapjs.getRootLayers().filter(layer => layer.type !== 'GeoJSON' && layer.type !== 'WMS' && layer.type !== 'WFS' && layer.type !== 'MVT');
  mapjs.removeWMC(mapjs.getWMC()[0]);
  mapjs.removeLayers(allLayers);
  mapjs.addWMC('http://mapea4-sigc.juntadeandalucia.es/files/wmc/context_cdau_hibrido.xml');
  console.log('change-CDAU')
});
document.getElementById('change-OSM').addEventListener('click', () => {
  const allLayers = mapjs.getRootLayers().filter(layer => layer.type !== 'GeoJSON' && layer.type !== 'WMS' && layer.type !== 'WFS' && layer.type !== 'MVT');
  mapjs.removeWMC(mapjs.getWMC()[0]);
  mapjs.removeLayers(allLayers);

  mapjs.addLayers('OSM*false');

  console.log('change-OSM')
});
document.getElementById('change-4326').addEventListener('click', () => {
  mapjs.removeLayers(mapjs.getRootLayers().find(l => l.type === 'MVT'))
  mapjs.setProjection('EPSG:4326*m')
  console.log('change-4326')
});