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
  wmcfile: ['callejero'],
});

const printer = new Printer({
  url: 'https://geoprint.desarrollo.guadaltel.es/print/SIGC',
  params: {
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

const ayuntamientos = new M.layer.WFS({
  url: 'http://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/Guadaltel/wms?',
  namespace: 'Guadaltel',
  name: 'guadaltel_pablo_hidrografia_2019_10_14',
  geometry: 'POINT',
  extract: true,
});

// mapjs.addWFS(ayuntamientos);

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

const styleHidro = new M.style.Category('cod_ent', {
  H1: rojop,
  H2: moradop,
  H3: amarillop,
  H4: verdep,
  H5: azulp,
});

ayuntamientos.setStyle(styleHidro);

// const optionsChartNoTexto = {
//   type: 'pie',
//   donutRatio: 0.5,
//   radius: 25,
//   offsetX: 0,
//   offsetY: 0,
//   stroke: {
//     color: 'white',
//     width: 1,
//   },
//   animation: true,
//   scheme: M.style.chart.schemes.Custom,
//   rotateWithView: true,
//   fill3DColor: '#CC33DD',
//   variables: [{
//     attribute: 's0303',
//     legend: 'Prestaciones PEAP',
//     fill: 'cyan',
//   }, {
//     attribute: 's0304',
//     legend: 'Prestaciones PECEF',
//     fill: 'blue',
//   }, {
//     attribute: 's0305',
//     legend: 'Prestaciones PEVS',
//     fill: 'pink',
//   }, {
//     attribute: 's0306',
//     legend: 'Prestaciones SAD',
//     fill: 'red',
//   }, {
//     attribute: 's0307',
//     legend: 'Prestaciones SAR',

//     fill: 'yellow',
//   }, {
//     attribute: 's0308',
//     legend: 'Prestaciones SAT',
//     fill: 'orange',
//   }, {
//     attribute: 's0309',
//     legend: 'Prestaciones UED',
//     fill: 'brown',
//   }],
// };

// const optionsChart = {
//   type: 'pie3D',
//   donutRatio: 0.5,
//   radius: 25,
//   offsetX: 100,
//   offsetY: 100,
//   stroke: {
//     color: 'white',
//     width: 1,
//   },
//   animation: true,
//   scheme: M.style.chart.schemes.Custom,
//   rotateWithView: true,
//   fill3DColor: '#CC33DD',
//   variables: [{
//     attribute: 's0303',
//     legend: 'Prestaciones PEAP',
//     fill: 'cyan',
//     label: {
//       text: '{{s0303}}',
//       radiusIncrement: 10,
//       stroke: {
//         color: '#000',
//         width: 2,
//       },
//       fill: 'cyan',
//       font: 'Comic Sans MS',
//       scale: 1.25,
//     },
//   }, {
//     attribute: 's0304',
//     legend: 'Prestaciones PECEF',
//     fill: 'blue',
//     label: {
//       text: '{{s0304}}',
//       radiusIncrement: 10,
//       stroke: {
//         color: '#000',
//         width: 2,
//       },
//       fill: 'cyan',
//       font: 'Comic Sans MS',
//       scale: 1.25,
//     },
//   }, {
//     attribute: 's0305',
//     legend: 'Prestaciones PEVS',
//     fill: 'pink',
//     label: {
//       text: '{{s0305}}',
//       radiusIncrement: 10,
//       stroke: {
//         color: '#000',
//         width: 2,
//       },
//       fill: 'cyan',
//       font: 'Comic Sans MS',
//       scale: 1.25,
//     },
//   }, {
//     attribute: 's0306',
//     legend: 'Prestaciones SAD',
//     fill: 'red',
//     label: {
//       text: '{{s0306}}',
//       radiusIncrement: 10,
//       stroke: {
//         color: '#000',
//         width: 2,
//       },
//       fill: 'cyan',
//       font: 'Comic Sans MS',
//       scale: 1.25,
//     },
//   }, {
//     attribute: 's0307',
//     legend: 'Prestaciones SAR',

//     fill: 'yellow',
//     label: {
//       text: '{{s0307}}',
//       radiusIncrement: 10,
//       stroke: {
//         color: '#000',
//         width: 2,
//       },
//       fill: 'cyan',
//       font: 'Comic Sans MS',
//       scale: 1.25,
//     },
//   }, {
//     attribute: 's0308',
//     legend: 'Prestaciones SAT',
//     fill: 'orange',
//     label: {
//       text: '{{s0308}}',
//       radiusIncrement: 10,
//       stroke: {
//         color: '#000',
//         width: 2,
//       },
//       fill: 'cyan',
//       font: 'Comic Sans MS',
//       scale: 1.25,
//     },
//   }, {
//     attribute: 's0309',
//     legend: 'Prestaciones UED',
//     fill: 'brown',
//     label: {
//       text: '{{s0309}}',
//       radiusIncrement: 10,
//       stroke: {
//         color: '#000',
//         width: 2,
//       },
//       fill: 'cyan',
//       font: 'Comic Sans MS',
//       scale: 1.25,
//     },
//   }],
// };

// const estadisticasPrestaciones = new M.style.Chart(optionsChartNoTexto);
// ayuntamientos.setStyle(estadisticasPrestaciones);
// const campamentos = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
//   name: 'campamentos',
//   legend: 'Campamentos',
//   geometry: 'MPOINT',
// });

// mapjs.addLayers(campamentos);

// const estiloBase = new M.style.Point({
//   radius: 5,
//   fill: {
//     color: 'yellow',
//     opacity: 0.5,
//   },
//   stroke: {
//     color: '#FF0000',
//   },
// });

// const estiloCluster = new M.style.Cluster();

// campamentos.setStyle(estiloBase);
// campamentos.setStyle(estiloCluster);

const layer2 = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Provincias',
  geometry: 'MPOLYGON',
  ids: '3,4',
});

const arboleda = new KML({
  url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
  name: 'Arboleda',
  extract: true,
});

// mapjs.addWFS(ayuntamientos);

const layerWMTS = new WMTS({
  url: 'http://www.ideandalucia.es/geowebcache/service/wmts',
  name: 'toporaster',
  matrixSet: 'EPSG:25830',
  legend: 'Toporaster',
});

// const printer = new Printer({
//   url: 'https://geoprint.desarrollo.guadaltel.es/print/CNIG',
//   params: {
//     layout: {
//       outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
//     },
//     pages: {
//       clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
//       creditos: 'Impresión generada a través de Mapea',
//     },
//     parameters: {
//       imageSpain: 'file://E01_logo_IGN_CNIG.png',
//       imageCoordinates: 'file://E01_logo_IGN_CNIG.png',
//     },
//   },
// }, {
//   options: {
//     legend: 'true',
//   },
// });

const layer = new M.layer.WFS({
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
layer.setStyle(styleProp);
mapjs.addLayers([layer, provincias]);

// const centros = new M.layer.WFS({
//   url: 'https://clientes.guadaltel.es/desarrollo/geossigc/wfs?',
//   namespace: 'mapea',
//   name: 'assda_centros',
//   legend: 'centrosassda',
//   geometry: 'POINT',
// });

// mapjs.addLayers(centros);

// centros.setStyle(new M.style.Cluster({
//   ranges: [{
//     min: 2,
//     max: 2000,
//     style: new M.style.Point({
//       stroke: {
//         color: 'black',
//       },
//       fill: {
//         color: 'red',
//       },
//       radius: 20,
//     }),
//   }],
//   label: {
//     color: 'black',
//   },
// }));

// Asignamos el estilo a la capa
// layer.setStyle(categoryStylep);

// mapjs.addWFS(campamentos);

// Estilo cluster por defecto

// Y asignamos a la capa la composicion creada
// M.proxy(false); // desactivar proxy
// campamentos.setStyle(estiloCluster);
// mapjs.addLayerGroup(layerGroup1);
// mapjs.addLayers(capaWMS);
// mapjs.addLayers([arboleda, layer]);
// mapjs.addKML(arboleda);
// mapjs.addWMTS(layerWMTS);
// mapjs.addWFS(layer2);
mapjs.addPlugin(printer);

window.mapjs = mapjs;
