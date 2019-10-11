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

// const layer2 = new WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Provincias',
//   geometry: 'MPOLYGON',
//   ids: '3,4',
// });

const arboleda = new KML({
  url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
  name: 'Arboleda',
  extract: true,
});

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

// const layer = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
//   namespace: 'sepim',
//   name: 'EstructuraJA',
//   legend: 'Menores de 15 años por provincia',
//   geometry: 'MPOLYGON',
// });

// const provincias = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Provincias',
//   geometry: 'MPOLYGON',
// });

// const estiloProvincias = new M.style.Polygon({
//   stroke: {
//     color: '#FF0000',
//     width: 1,
//   },
// });

// provincias.setStyle(estiloProvincias);

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
//     },
//   },
// }));
// layer.setStyle(styleProp);
// mapjs.addLayers([layer, provincias]);

// const layer = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'ind_mun_simp',
//   legend: 'Municipios SIM',
//   geometry: 'MPOLYGON',
// });

// mapjs.addLayers([layer]);

// Colores para categorizar
const verdep = new M.style.Polygon({
  fill: {
    color: 'green',
  },
  stroke: {
    color: 'black',
  },
});

const amarillop = new M.style.Polygon({
  fill: {
    color: 'pink',
  },
  stroke: {
    color: 'black',
  },
});

const rojop = new M.style.Polygon({
  fill: {
    color: 'red',
  },
  stroke: {
    color: 'black',
  },
});

const azulp = new M.style.Polygon({
  fill: {
    color: 'grey',
  },
  stroke: {
    color: 'black',
  },
});

const naranjap = new M.style.Polygon({
  fill: {
    color: 'orange',
  },
  stroke: {
    color: 'black',
  },
});

const marronp = new M.style.Polygon({
  fill: {
    color: 'brown',
  },
  stroke: {
    color: 'black',
  },
});

const magentap = new M.style.Polygon({
  fill: {
    color: '#e814d9',
  },
  stroke: {
    color: 'black',
  },
});

const moradop = new M.style.Polygon({
  fill: {
    color: '#b213dd',
  },
  stroke: {
    color: 'black',
  },
});

// Se definen las relaciones valor-estilos
const categoryStylep = new M.style.Category('provincia', {
  Almería: marronp,
  Cádiz: amarillop,
  Córdoba: magentap,
  Granada: verdep,
  Jaén: naranjap,
  Málaga: azulp,
  Sevilla: rojop,
  Huelva: moradop,
});

// layer.setStyle(categoryStylep);

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
mapjs.addKML(arboleda);
// mapjs.addWMTS(layerWMTS);
// mapjs.addWFS(layer2);
mapjs.addPlugin(printer);

window.mapjs = mapjs;
