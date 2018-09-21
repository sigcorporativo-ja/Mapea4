import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import Polygon from 'M/style/Polygon';
import Category from 'M/style/Category';
import { LOAD as LoadEvt, SELECT_FEATURES as SelectFeaturesEvt } from 'M/event/eventtype';

const mapajs = Mmap({
  container: 'map',
  controls: ['mouse', 'layerswitcher'],
  layers: ['WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*false'],
  projection: 'EPSG:25830*m',
});

window.mapjs = mapajs;


const layer = new WFS({
  url: 'https://clientes.guadaltel.es/desarrollo/geossigc/wfs?',
  namespace: 'mapea',
  name: 'da_municipio_pol',
  legend: 'Municipios - Plantilla Símbolo',
  geometry: 'POLYGON',
});

mapajs.addLayers([layer]);

const incognita = new Polygon({
  fill: {
    color: 'green',
    opacity: 0.8,
  },
  stroke: {
    color: 'black',
    width: 1,
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});

layer.on(LoadEvt, () => {
  layer.setStyle(incognita);
});

// Juego
const yavistos = new Polygon({
  fill: {
    color: 'orange',
    opacity: 0.5,
  },
  stroke: {
    color: 'black',
    width: 1,
  },
  label: {
    text(feature) {
      return (feature.getAttribute('nombre'));
    },
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});
const seleccionado = new Polygon({
  fill: {
    color: 'yellow',
    opacity: 0.5,
  },
  stroke: {
    color: 'black',
    width: 1,
  },
  label: {
    text(feature) {
      return (feature.getAttribute('nombre'));
    },
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});

// version que no oculta los ya seleccionados
let anteriores = [];

layer.on(SelectFeaturesEvt, (features) => {
  layer.redraw();
  anteriores.forEach((feat) => {
    feat.setStyle(yavistos);
  });

  features[0].setStyle(seleccionado);
  anteriores.push(features[0]);
});


function resetea() {
  anteriores = [];
  layer.setStyle(incognita);
  layer.redraw();
}


// Colores para categorizar
const verdep = new Polygon({
  fill: {
    color: 'green',
  },
  stroke: {
    color: '',
    black: '',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});


const amarillop = new Polygon({
  fill: {
    color: 'pink',
  },
  stroke: {
    color: '',
    black: '',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});

const rojop = new Polygon({
  fill: {
    color: 'red',
  },
  stroke: {
    color: '',
    black: '',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});


const azulp = new Polygon({
  fill: {
    color: 'grey',
  },
  stroke: {
    color: '',
    black: '',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});

const naranjap = new Polygon({
  fill: {
    color: 'orange',
  },
  stroke: {
    color: '',
    black: '',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});

const marronp = new Polygon({
  fill: {
    color: 'brown',
  },
  stroke: {
    color: '',
    black: '',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});

const magentap = new Polygon({
  fill: {
    color: '#e814d9',
  },
  stroke: {
    color: '',
    black: '',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});

const moradop = new Polygon({
  fill: {
    color: '#b213dd',
  },
  stroke: {
    color: '',
    black: '',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      color: '#E5FFCC',
      width: 3,
    },
  },
});

const categoryStylep = new Category('nom_provincia', {
  ALMERIA: marronp,
  CADIZ: amarillop,
  CORDOBA: magentap,
  GRANADA: verdep,
  JAEN: naranjap,
  MALAGA: azulp,
  SEVILLA: rojop,
  HUELVA: moradop,
});
