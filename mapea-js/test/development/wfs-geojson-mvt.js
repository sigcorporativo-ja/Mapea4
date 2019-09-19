import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import GeoJSON from 'M/layer/GeoJSON';
import MVT from 'M/layer/MVT';
import LayerGroup from 'M/layer/LayerGroup';


const mapjs = Mmap({
  container: 'map',
  controls: ['layerswitcher'],
  projection: 'EPSG:25830*m',
  layers: ['OSM']
});

const provincias = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
  ids: '3,4',
});

const municipios = new GeoJSON({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=50&outputFormat=application%2Fjson',
  name: 'Municipios',
});

const mvt = new MVT({
  url: 'https://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/gwc/service/tms/1.0.0/Global:sp___estaciones_sev_f7635e5b_5061_49a4_8124_e1c5846c2ffa@EPSG%3A25830@pbf/{z}/{x}/{-y}.pbf',
  name: 'Nombre mvt',
  legend: 'Leyenda mvt',
  projection: mapjs.getProjection().code
});

document.getElementById('change-CDAU').addEventListener('click', () => {
  const allLayers = mapjs.getRootLayers().filter(layer => layer.type !== 'GeoJSON' && layer.type !== 'WMS' && layer.type !== 'WFS' && layer.type !== 'MVT');
  mapjs.removeWMC(mapjs.getWMC()[0]);
  mapjs.removeLayers(allLayers);

  mapjs.addWMC('cdau');

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
  mapjs.setProjection('EPSG:4326*m')
  console.log('change-4326')
});

mapjs.addLayers([provincias, municipios, mvt]);
