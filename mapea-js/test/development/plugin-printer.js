import Printer from 'plugins/printer/facade/js/printer';

const mapjs = M.map({
  container: 'map',
});

const plugin = new Printer({
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

mapjs.addPlugin(plugin);

window.mapjs = mapjs;
