import Attributetable from 'plugins/attributetable/facade/js/attributetable';

const mapjs = M.map({
  container: 'map',
  controls: ['layerswitcher', 'getfeatureinfo'],
});



const estiloSeleccion = new M.style.Generic({
  point: {
    radius: 5,
    fill: {
      color: 'red',
      opacity: 1,
    },
    stroke: {
      color: 'red',
      width: 2,
    },
  },
  polygon: {
    fill: {
      color: 'red',
      opacity: 0.6,
    },
    stroke: {
      color: 'yellow',
      width: 1,
    },
  },
  line: {
    stroke: {
      color: 'red',
      width: 2,
    },
    fill: {
      color: 'red',
      width: 2,
      opacity: 0.6,
    },
  },
});

const attributetable = new Attributetable({ pages: 5 /* , selectedStyle:estiloSeleccion */ });
mapjs.addPlugin(attributetable);

let campamentosa = new M.layer.GeoJSON({
  name: "Campamentos",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&",
  extract: true,
  legend: 'Campamentos A'
});
window.campamentosa = campamentosa;

let conduccion = new M.layer.GeoJSON({
  name: "Conduccion",
  url: "http://www.ideandalucia.es/services/DERA_g3_hidrografia/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=DERA_g3_hidrografia:g03_08_Conduccion&TYPENAME=DERA_g3_hidrografia:g03_08_Conduccion&STARTINDEX=0&COUNT=1000000&SRSNAME=urn:ogc:def:crs:EPSG::25830&OUTPUTFORMAT=json",
  extract: true,
  legend: 'Conduccion'
});
window.conduccion = conduccion;

let campamentosB = new M.layer.GeoJSON({
  name: "Campamentos",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&",
  extract: true,
  legend: 'Campamentos b'
});

let provincias = new M.layer.GeoJSON({
  name: "Provincias",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application%2Fjson",
  extract: true,
  legend: 'Provincias'
});

window.provincias = provincias;


let estiloPunto = new M.style.Generic({
  point: {
    radius: 5,
    fill: {
      color: 'orange',
      opacity: '0.8'
    },
    stroke: {
       color: 'red',
       width: 1,
     },
    icon: {
      src: 'http://mapea4-sigc.juntadeandalucia.es/assets/img/m-pin-24-sel.svg',
      rotation: 0,
      scale: 1,
      opacity: 0.8,
      anchor: [0.5, 1],
      rotate: false,
    },
   }
  });
  
  campamentosa.setStyle(estiloPunto);


mapjs.addLayers([/*, campamentosB,*/ provincias,campamentosa,conduccion]);

let verde = new M.style.Polygon({fill: {color: 'green'}});
let amarillo = new M.style.Polygon({fill: {color: 'pink'}});
let rojo = new M.style.Polygon({fill: {color: 'red'}});
let azul = new M.style.Polygon({fill: {color: 'grey'}});
let naranja = new M.style.Polygon({fill: {color: 'orange'}});
let marron = new M.style.Polygon({fill: {color: 'brown'}});
let magenta = new M.style.Polygon({fill: {color: '#e814d9'}});
let morado = new M.style.Polygon({fill: {color: '#b213dd'}});

// Creamos la simbologia. El atributo "provincia" contiene el nombre
// de la provincia a la que pertenece cada feature
let categoryStyle = new M.style.Category("nombre", {
  "Almería": marron,
  "Cádiz": amarillo,
  "Córdoba": magenta,
  "Granada": verde,
  "Jaén": naranja,
  "Málaga": azul,
  "Sevilla": rojo,
  "Huelva": morado
});

provincias.setStyle(categoryStyle);
