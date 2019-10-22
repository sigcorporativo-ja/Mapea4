import Printer from 'plugins/printer/facade/js/printer';
import { map as Mmap } from 'M/mapea';
import MVT from 'M/layer/MVT';
import stylePolygon from 'M/style/Polygon';
import stylePoint from 'M/style/Point';

window.stylePolygon = stylePolygon;
window.stylePoint = stylePoint;

const mapjs = M.map({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['mouse'],
  layers: ['OSM'],
});

// MVT*URL*NAME

// const mvt = new MVT('MVT*https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf*vectortile');
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

const mvt = new MVT({
  url: 'http://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/gwc/service/tms/1.0.0/PRUEBAS:upruebas___hs1_400___11cc5544_fe41_4137_ad60_591d023dbf90@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
  name: 'vectortile',
  projection: 'EPSG:3857',
});

// mapjs.addLayers(mvt);
mapjs.addPlugin(printer);
window.mapjs = mapjs;
