import { map } from 'M/mapea';
// import WMC from 'M/layer/WMC';
import LayerGroup from 'M/layer/LayerGroup';
import GeoJSON from 'M/layer/GeoJSON';
// import KML from 'M/layer/KML';
import WFS from 'M/layer/WFS';

const mapa = map({ container: 'map', layers: ['OSM'], controls: ['layerswitcher'] });

const provincias = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
  ids: '3,4'
});

//layers
const municipios = new GeoJSON({ url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=50&outputFormat=application%2Fjson', name: 'Municipios' });
const distritosSanitarios = new GeoJSON({ url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:distrito_sanitario&maxFeatures=50&outputFormat=application%2Fjson', name: 'Distritos Sanitarios' });
//layerGroups
const layerGroup1 = new LayerGroup(undefined, 'Grupo 1');
const layerGroup2 = new LayerGroup(undefined, 'Grupo 2');
const layerGroup3 = new LayerGroup(undefined, 'Grupo 3');

// mapa.addLayers([provincias, municipios, distritosSanitarios])

layerGroup1.addChild(provincias);
layerGroup2.addChild(municipios);
layerGroup3.addChild(distritosSanitarios);

layerGroup1.order = 2;
layerGroup3.order = 3;
layerGroup2.order = 1;

mapa.addLayerGroup(layerGroup3);
mapa.addLayerGroup(layerGroup2);
mapa.addLayerGroup(layerGroup1);

window.map = mapa;
