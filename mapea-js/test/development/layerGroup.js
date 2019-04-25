import { map } from 'M/mapea';
// import WMC from 'M/layer/WMC';
import LayerGroup from 'M/layer/LayerGroup';
import GeoJSON from 'M/layer/GeoJSON';
// import KML from 'M/layer/KML';
import WFS from 'M/layer/WFS';

const mapa = map({
  container: 'map',
  // wmcfile: new WMC({
  //   name: 'pruebaGroup',
  //   url: 'https://gischgdes.chguadalquivir.es/chgcloud/restapi/context/xml/66e43461-5402-46fc-a19b-590b6b1ae121',
  // }),
  controls: ['overviewmap', 'scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
});

const layerGroup = new LayerGroup({ title: 'Grupo Prueba' });


const layer = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
  ids: '3,4',
});

const layerGeojson1 = new GeoJSON({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=50&outputFormat=application%2Fjson',
  name: 'Municipios',
});

const layerDistritosSanitarios = new GeoJSON({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:distrito_sanitario&maxFeatures=50&outputFormat=application%2Fjson',
  name: 'Distritos Sanitarios',
});

layerGroup.addChild(layer);
layerGroup.addChild(layerGeojson1);
layerGroup.addChild(layerDistritosSanitarios);
mapa.addLayerGroup(layerGroup);


window.map = map;
