import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import GeoJSON from 'M/layer/GeoJSON';
import LayerGroup from 'M/layer/LayerGroup';


const mapjs = Mmap({
  container: 'map',
  controls: ['layerswitcher'],
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

const distritosSanitarios = new GeoJSON({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:distrito_sanitario&maxFeatures=50&outputFormat=application%2Fjson',
  name: 'Distritos Sanitarios',
});

const layerGroup = new LayerGroup({
  title: 'Grupo1',
  collapsed: false,
  order: 4, // dentro del grupo de capas
  children: [provincias, municipios],
  zIndex: 100,
});
const layerGroup2 = new LayerGroup({
  title: 'Grupo2',
  collapsed: true,
  order: 4,
  children: [distritosSanitarios],
  zIndex: 3,
});

layerGroup.addChild(layerGroup2);
mapjs.addLayerGroup(layerGroup);
