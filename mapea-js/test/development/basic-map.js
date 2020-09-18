import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import GeoJSON from 'M/layer/GeoJSON';
import LayerGroup from 'M/layer/LayerGroup';

const mapjs = Mmap({
  container: 'map',
  wmcfile: ['cdau', 'cdau_hibrido'],
  controls: ["scale", "scaleline", "panzoombar", "panzoom", "layerswitcher", "mouse", "overviewmap", "location", "rotate"],
  getfeatureinfo: 'html'
});

window.map = mapjs;


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

// const distritosSanitarios = new GeoJSON({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:distrito_sanitario&maxFeatures=50&outputFormat=application%2Fjson',
//   name: 'Distritos Sanitarios',
// });

// mapjs.addLayers([municipios, distritosSanitarios, provincias]);

// const layerGroup = new LayerGroup({
//   title: 'Grupo1',
//   collapsed: false,
// });

// document.getElementById('btn1').addEventListener('click', () => {
//   mapjs.addLayerGroup(layerGroup);
//   layerGroup.addChild(municipios);
// });
// document.getElementById('btn2').addEventListener('click', () => {
//   layerGroup.addChild(distritosSanitarios);
// });
// document.getElementById('btn3').addEventListener('click', () => {
//   layerGroup.addChild(provincias);
// });
// document.getElementById('btn4').addEventListener('click', () => {
//   mapjs.removeLayerGroup(layerGroup);
// });
