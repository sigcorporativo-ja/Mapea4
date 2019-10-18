import Printer from 'plugins/printer/facade/js/printer';
import WMS from 'M/layer/WMS';
import GeoJSON from 'M/layer/GeoJSON';
import LayerGroup from 'M/layer/LayerGroup';
import WFS from 'M/layer/WFS';
import KML from 'M/layer/KML';
import WMTS from 'M/layer/WMTS';
import Point from 'M/style/Point';
import Cluster from 'M/style/Cluster';

const mapjs = M.map({
  container: 'map',
  controls: ['layerswitcher'],
});

// Se crea el plugin del printer
const printer = new Printer({
  url: 'https://geoprint.desarrollo.guadaltel.es/print/SIGC',
  params: {
    urlApplication: 'https://geoprint.desarrollo.guadaltel.es',
    layout: {
      outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
    },
    pages: {
      clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
      creditos: 'Impresión generada a través de Mapea',
    },
    parameters: {
      imagenCoordenadas: 'file://windrose.png',
      imagenAndalucia: 'file://logo_JA.png',
    },
  },
  options: {
    legend: 'true',
  },
});

// Capa con los ríos de Andalucía
const rios = new M.layer.WFS({
  url: 'http://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/Guadaltel/wms?',
  namespace: 'Guadaltel',
  name: 'guadaltel_pablo_hidrografia_2019_10_14',
  geometry: 'POINT',
  extract: true,
});

const rojop = new M.style.Line({
  stroke: {
    color: '#FF0000',
    width: '5',
  },
});

const moradop = new M.style.Line({
  stroke: {
    color: '#FF00FF',
    width: '3',
  },
});

const amarillop = new M.style.Line({
  stroke: {
    color: '#FFF056',
  },
});

const verdep = new M.style.Line({
  stroke: {
    color: '#00FF00',
  },
});

const azulp = new M.style.Line({
  stroke: {
    color: '#0000FF',
  },
});

// Estilo para los ríos, categoría
const styleHidro = new M.style.Category('cod_ent', {
  H1: rojop,
  H2: moradop,
  H3: amarillop,
  H4: verdep,
  H5: azulp,
});

// Se añade el estilo a la capa
rios.setStyle(styleHidro);

// Capa con campamentos de andalucía
const campamentos = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
  name: 'campamentos',
  legend: 'Campamentos',
  geometry: 'MPOINT',
});

const estiloBase = new M.style.Point({
  radius: 5,
  fill: {
    color: 'yellow',
    opacity: 0.5,
  },
  stroke: {
    color: '#FF0000',
  },
});

// Se agrupan los campamentos en clusters
const estiloCluster = new M.style.Cluster();

campamentos.setStyle(estiloBase);
campamentos.setStyle(estiloCluster);

// Capa con estilo para las provincias de Córdoba y Granada
const provinciasCordobaGranada = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
  ids: '3,4',
});

// Capa con árboles de Andalucía
const arboleda = new KML({
  url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
  name: 'Arboleda',
  extract: true,
});

// Capa WMTS
const toporaster = new WMTS({
  url: 'http://www.ideandalucia.es/geowebcache/service/wmts',
  name: 'toporaster',
  matrixSet: 'EPSG:25830',
  legend: 'Toporaster',
});

// Capa con los menores de 15 años por provincia
const estructuraJA = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
  namespace: 'sepim',
  name: 'EstructuraJA',
  legend: 'Menores de 15 años por provincia',
  geometry: 'MPOLYGON',
});

const provincias = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
});

// Estilo para bordear las provincias de color rojo
const estiloProvincias = new M.style.Polygon({
  stroke: {
    color: '#FF0000',
    width: 1,
  },
});

provincias.setStyle(estiloProvincias);

const styleProp = new M.style.Proportional('id', 5, 15, new M.style.Point({
  fill: {
    color: '#000000',
  },
  stroke: {
    color: '#FFFFFF',
    width: 2,
  },
  label: {
    text: '{{id}}',

    offset: [0, 20],
    stroke: {
      color: 'yellow', // Color de relleno del halo
      width: 2,
    },
  },
}));
estructuraJA.setStyle(styleProp);

// mapjs.addLayers(campamentos);
// mapjs.addWFS(rios);
// mapjs.addKML(arboleda);
// mapjs.addLayers([estructuraJA, provincias]);
// mapjs.addWMTS(toporaster);
// mapjs.addWFS(provinciasCordobaGranada);
// mapjs.addWFS(provincias);
mapjs.addPlugin(printer);

window.mapjs = mapjs;
