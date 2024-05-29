import { map } from 'M/mapea';
// import WMS from 'M/layer/WMS';
import LayerGroup from 'M/layer/LayerGroup';
// import * as EventType from 'M/event/eventtype';
// import GeoJSON from 'M/layer/GeoJSON';
// import KML from 'M/layer/KML';
import WFS from 'M/layer/WFS';

const mapa = map({ container: 'map', controls: ['layerswitcher'] });

// const provincias = new WFS({
//   url: 'https://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/Global/wfs?*',
//   name: 'provincias_cb3d956a_94b4_4616_9f8c_80f3b9af2649',
//   legend: 'Provincias',
// });

// layers
const centrosMedicos = new WFS({
  url: 'https://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/Global/wfs?*',
  name: 'centros_medicos_2da3a991_a621_4a01_b4c0_a9c7f90d1f00',
  legend: 'Centros Medicos',
  tiled: true,
});

const nucleo = new WFS({
  url: 'https://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/Global/wfs?*',
  name: 'cc___nucleo_poblacio_5d382c56_5337_4725_a993_e8ba32a1f287',
  legend: 'Nucleo',
  tiled: true,
});

const provinciasWMS = new WFS({
  url: 'https://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/guadaltel_prod/wfs?*',
  name: 'u2_red_nacional_de_p_1ac4a9b2_dde9_4a83_9569_93ef5cfb1f60',
  legend: 'provinciasWMS',
  tiled: true,
});

// const wms = new WMS({
//   url: 'http://www.callejerodeandalucia.es/servicios/base/wms?',
//   name: 'CDAU_toponimia',
//   legend: 'Toponimia',
//   transparent: true,
//   tiled: false,
// });

// layerGroups
const layerGroup1 = new LayerGroup(undefined, 'Grupo 1');
// const layerGroup2 = new LayerGroup(undefined, 'Grupo 2');
// const layerGroup3 = new LayerGroup(undefined, 'Grupo 3');

// mapa.addLayers(layerWMS);

// layerGroup1.addChild(centrosMedicos);
// layerGroup1.addChild(nucleo);

// layerGroup1.order = 2;
// layerGroup3.order = 3;
// layerGroup2.order = 1;

// mapa.addLayerGroup(layerGroup3);
// mapa.addLayerGroup(layerGroup2);
layerGroup1.title = 'Grupo1';
mapa.addLayerGroup(layerGroup1);

mapa.addLayers(centrosMedicos);

const btn = document.getElementById('btnAdd');
btn.addEventListener('click', () => {
  mapa.removeLayers(centrosMedicos);
  layerGroup1.addChild(centrosMedicos);
  mapa.addLayerGroup(layerGroup1);
});

const btn2 = document.getElementById('btnAddLayer1');
btn2.addEventListener('click', () => {
  const lgToDelete = mapa.getLayerGroup().find((lg) => lg.title === 'Grupo1');
  mapa.removeLayerGroup(lgToDelete);
  const nLayerGroup = new LayerGroup();
  nLayerGroup.title = lgToDelete.title;
  nLayerGroup.addChild(centrosMedicos);
  nLayerGroup.addChild(nucleo);
  mapa.addLayerGroup(nLayerGroup);
});

const btn3 = document.getElementById('btnAddLayer2');
btn3.addEventListener('click', () => {
  const lgToDelete = mapa.getLayerGroup().find((lg) => lg.title === 'Grupo1');
  mapa.removeLayerGroup(lgToDelete);
  const nLayerGroup = new LayerGroup();
  nLayerGroup.title = lgToDelete.title;
  nLayerGroup.addChild(centrosMedicos);
  nLayerGroup.addChild(nucleo);
  nLayerGroup.addChild(provinciasWMS);
  mapa.addLayerGroup(nLayerGroup);
});

const btn4 = document.getElementById('btnAddLayer3');
btn4.addEventListener('click', () => {
  const lgToDelete = mapa.getLayerGroup().find((lg) => lg.title === 'Grupo1');
  mapa.removeLayerGroup(lgToDelete);
});

window.map = mapa;
