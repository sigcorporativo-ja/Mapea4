import Printer from 'plugins/printer/facade/js/printer';
import WMS from 'M/layer/WMS';
import GeoJSON from 'M/layer/GeoJSON';
import LayerGroup from 'M/layer/LayerGroup';
import WFS from 'M/layer/WFS';
import KML from 'M/layer/KML';
import WMTS from 'M/layer/WMTS';

const mapjs = M.map({
  container: 'map',
  controls: ['layerswitcher'],
  wmcfiles: ['cdau'],
});


// const campamentos = new GeoJSON({
//   name: 'Campamentos',
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
//   extract: true,
// });

const provincias = new GeoJSON({
  name: 'Provincias',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json',
  extract: true,
});

// const layerGroup1 = new LayerGroup({
//   id: 'id_grupo_1',
//   title: 'Grupo 1',
//   collapsed: true,
//   zIndex: 100000,
//   children: [provincias, campamentos],
//   order: 0,
// });


const capaWMS = new WMS({
  url: 'https://www.ideandalucia.es/services/andalucia/wms?',
  name: '05_Red_Viaria',
  legend: 'Red Viaria',
  transparent: true,
  tiled: false,
});

const layer = new WFS({
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

const layerWMTS = new WMTS({
  url: 'http://www.ideandalucia.es/geowebcache/service/wmts',
  name: 'toporaster',
  matrixSet: 'EPSG:25830',
  legend: 'Toporaster',
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
      imagenCoordenadas: 'http://www.juntadeandalucia.es/medioambiente/BIO/DOC/ARB_SING/gfx/logojunta.gif',
      imagenEscala: 'file://E01_logo_IGN_CNIG.png',
    },
  },
}, {
  options: {
    legend: 'true',
  },
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

const campamentos = new WFS({
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
  }
});

// Estilo cluster por defecto
const estiloCluster = new M.style.Cluster();

// Y asignamos a la capa la composicion creadaç
campamentos.setStyle(estiloBase);
campamentos.setStyle(estiloCluster);


// mapjs.addLayerGroup(layerGroup1);
mapjs.addLayers(campamentos);
// M.proxy(false); // desactivar proxy
// mapjs.addLayers([arboleda, layer]);
mapjs.addKML(arboleda);
// mapjs.addWMTS(layerWMTS);
mapjs.addWFS(layer);
mapjs.addPlugin(printer);

window.mapjs = mapjs;
