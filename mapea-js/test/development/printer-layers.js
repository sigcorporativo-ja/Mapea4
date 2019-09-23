import Printer from 'plugins/printer/facade/js/printer';
import WMS from 'M/layer/WMS';
import GeoJSON from 'M/layer/GeoJSON';

const mapjs = M.map({
  container: 'map',
  controls: ['layerswitcher'],
});

const campamentos = new GeoJSON({
  name: 'Campamentos',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
  extract: true,
});


const capaWMS = new WMS({
  url: 'https://www.ideandalucia.es/services/andalucia/wms?',
  name: '05_Red_Viaria',
  legend: 'Red Viaria',
  transparent: true,
  tiled: false,
});

const printer = new Printer({
  url: 'https://geoprint.desarrollo.guadaltel.es/print/sigc-integracion',
  params: {
    layout: {
      outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
    },
    pages: {
      clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
      creditos: 'Impresión generada a través de Mapea',
    },
  },
}, {
  options: {
    legend: 'true',
  },
});

mapjs.addLayers([campamentos, capaWMS]);
mapjs.addPlugin(printer);

window.mapjs = mapjs;
