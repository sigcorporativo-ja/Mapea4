import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';
import Printerdos from 'plugins/printerdos/facade/js/printerdos'
import Geosearch from 'plugins/geosearch/facade/js/geosearch'

const mapjs = M.map({
  container: 'map',
  projection: 'EPSG:3857*m',
  layers: ['OSM']
});

M.config.PROXY_URL = "https://mapea4-sigc.juntadeandalucia.es/mapea/api/proxy";

M.config('geoprint2', {

  'URL': "https://geoprint.desarrollo.guadaltel.es/print/SIGC",
  'URL_APPLICATION': "https://geoprint.desarrollo.guadaltel.es/",
});



const plugins = new Printerdos({
  "params": {
    "layout": {
      "outputFilename": "mapea_${yyyy-MM-dd_hhmmss}"
    },
    "pages": {
      "clientLogo": "http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif",
      "creditos": "Impresión generada a través de Mapea"
    }
  }
}, {
  "options": {
    "legend": "true"
  }
});

// mapjs.addLayers('WFST*CapaWFS*http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?*tematicos:Provincias*MPOLYGON');

let urlGeoserver = "https://ws096.juntadeandalucia.es/geoserver/";
mapjs.addPlugin(plugins);
let tumbas = new M.layer.GeoJSON({
  name: "Acceso tumbas",
  url: urlGeoserver + "sicac/wfs?" + "service=WFS&version=1.1.0&request=GetFeature&typeName=sicac:tumbas&outputFormat=application/json",
  extract: false
});
let tumbas_sty = new M.style.Polygon({
  fill: {
    color: '#32515B',
    opacity: 0.8
  },
  stroke: {
    color: '#32515B',
    width: 1
  },
  label: {
    text: '{{NOMBRE}}',
    font: '12px Alegreya Sans",sans-serif',
    color: '#505050',
    stroke: {
      color: '#FFFFFF',
      width: 2
    },
    rotate: true,
    align: M.style.align.LEFT,
    baseline: M.style.baseline.MIDDLE
  }
});
tumbas.setStyle(tumbas_sty);
mapjs.addLayers(tumbas)
window.mapjs = mapjs;
