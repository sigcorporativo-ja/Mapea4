import { map } from 'M/mapea';
// import WMC from 'M/layer/WMC';
import LayerGroup from 'M/layer/LayerGroup';
import GeoJSON from 'M/layer/GeoJSON';
// import KML from 'M/layer/KML';
import WFS from 'M/layer/WFS';

const mapa = map({
  container: 'map',
  layers: ['OSM'],
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
const layerGroup = new LayerGroup(undefined, 'Grupo de Prueba');
layerGroup.addChild(provincias);
layerGroup.addChild(municipios);
layerGroup.addChild(distritosSanitarios);
mapa.addLayerGroup(layerGroup);


window.map = map;
