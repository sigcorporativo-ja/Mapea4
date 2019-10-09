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
}, {
  options: {
    legend: 'true',
  },
});

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

// const layer = new WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Provincias',
//   geometry: 'MPOLYGON',
//   ids: '3,4',
// });

// const arboleda = new KML({
//   url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
//   name: 'Arboleda',
//   extract: true,
// });

// const layerWMTS = new WMTS({
//   url: 'http://www.ideandalucia.es/geowebcache/service/wmts',
//   name: 'toporaster',
//   matrixSet: 'EPSG:25830',
//   legend: 'Toporaster',
// });

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

// provincias.setStyle(estiloProvincias);

mapjs.addLayers([provincias]);

// const styleProp = new M.style.Proportional('id', 5, 15, new M.style.Point({
//   fill: {
//     color: '#000000',
//   },
//   stroke: {
//     color: '#FFFFFF',
//     width: 2,
//   },
//   label: {
//     text: '{{id}}',

//     offset: [0, 20],
//     stroke: {
//       color: 'yellow', // Color de relleno del halo
//       width: 2,
//     }
//   }
// }));

// lo establecemos a la capa
// layer.setStyle(styleProp);

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
// mapjs.addWFS(layer);
mapjs.addPlugin(printer);

window.mapjs = mapjs;
