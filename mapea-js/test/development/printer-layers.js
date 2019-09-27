import Printer from 'plugins/printer/facade/js/printer';
import WMS from 'M/layer/WMS';
import GeoJSON from 'M/layer/GeoJSON';
import LayerGroup from 'M/layer/LayerGroup';
import WFS from 'M/layer/WFS';

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

// const provincias = new GeoJSON({
//   name: 'Provincias',
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json',
//   extract: true,
// });

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

// const layer = new WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Provincias',
//   geometry: 'MPOLYGON',
//   ids: '3,4',
// });

// const printer = new Printer({
//   url: 'https://geoprint.desarrollo.guadaltel.es/print/SIGC',
//   params: {
//     layout: {
//       outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
//     },
//     pages: {
//       clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
//       creditos: 'Impresión generada a través de Mapea',
//     },
//     parameters: {
//       imagenCoordenadas: 'file://E01_logo_IGN_CNIG.png',
//       imagenEscala: 'file://E01_logo_IGN_CNIG.png',
//     },
//   },
// }, {
//   options: {
//     legend: 'true',
//   },
// });

const printer = new Printer({
  url: 'https://geoprint.desarrollo.guadaltel.es/print/CNIG',
  params: {
    layout: {
      outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
    },
    pages: {
      clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
      creditos: 'Impresión generada a través de Mapea',
    },
    parameters: {
      imageSpain: 'file://E01_logo_IGN_CNIG.png',
      imageCoordinates: 'file://E01_logo_IGN_CNIG.png',
    },
  },
}, {
  options: {
    legend: 'true',
  },
});

// mapjs.addLayerGroup(layerGroup1);
// mapjs.addLayers([capaWMS]);
// M.proxy(false); desactivar proxy
// mapjs.addWFS(layer);
mapjs.addPlugin(printer);

window.mapjs = mapjs;
