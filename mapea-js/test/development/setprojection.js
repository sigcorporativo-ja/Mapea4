import { map as Mmap } from 'M/mapea';

const escogerLayer = 3;
const POINTS = [{ // LAYER 0 // No se ve bien o sale completamente en blanco este layer.
  layer: 'WMS*Limites provinciales de Andalucia*https://www.ideandalucia.es/wms/mta400v_2008?*Division_Administrativa*false',
  projection: 'EPSG:4326*d',
  center: [37.3389, -5.9337],
  zoom: 0,
}, { // LAYER 1
  layer: 'WMS*Ortofoto Andalucia 2013*https://www.ideandalucia.es/wms/ortofoto2013?*oca10_2013*false',
  projection: 'EPSG:25830*m',
  center: [240103.69, 4136506.40],
  zoom: 15,
}, { // LAYER 2 // Hay 3 capas, pero solo se ve una, las demas son transparentes.
  layer: 'WMS_FULL*https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_modelo_altura_vege_incendio_la_granada_rio_tinto?*true',
  projection: 'EPSG:3857*m',
  center: [-714764, 4543123],
  zoom: 15,
}, { // LAYER 3 // Parece estar roto el orden de los tiles de {X}/{Y}/{Z}.
  layer: 'WMS*Nucleos de Poblacion*https://www.ideandalucia.es/wms/mta100v_2005?*Nucleos_de_Poblacion*true',
  projection: 'EPSG:4258*d',
  center: [37.3479, -4.59981],
  zoom: 1,
}, { // LAYER 4 // No se ve esta capa, parece ser completamente transparente en todos los casos.
  layer: 'WMS*Toponimia*https://www.ideandalucia.es/wms/mta100v_2005?*Toponimia_Nucleos_de_Poblacion*true',
  projection: 'EPSG:23030*m',
  center: [240202.85, 4136708.95],
  zoom: 1,
}];
const selectedPoint = POINTS[escogerLayer];
const mapjs = Mmap({
  container: 'map',
  // layers: ['OSM'],
  // controls: ['layerswitcher', 'panzoom'],
  // projection: 'EPSG:4326*d',
  layers: [selectedPoint.layer],
  controls: ['layerswitcher', 'panzoom'],
  center: selectedPoint.center,
  projection: selectedPoint.projection,
  zoom: selectedPoint.zoom,
});

window.mapjs = mapjs;
