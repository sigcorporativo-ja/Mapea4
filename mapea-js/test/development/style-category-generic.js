import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import Category from 'M/style/Category';
import Generic from 'M/style/Generic';
import Cluster from 'M/style/Cluster';
// import StylePoint from 'M/style/Point';

import * as form from 'M/style/Form';

const mapjs = map({
  container: 'map',
  controls: ['layerswitcher'],
});

const campamentos = new WFS({
  legend: 'Campamentos',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs',
  namespace: 'sepim',
  name: 'campamentos',
  geometry: 'POINT',
  extract: true,
});
mapjs.addLayers(campamentos);

/* / Estilos para categorización
const primera = new StylePoint({
  icon: {
    src: 'https://ws058.juntadeandalucia.es/geoserver/styles/geoportal-cips/iconos/personas_victimas_genero/centroresidencial_vg.png',
    scale: 0.5,
  },
}); // */

// Estilo generico de primera
const primera = new Generic({
  point: {
    icon: {
      src: 'https://cdn0.iconfinder.com/data/icons/citycons/150/Citycons_building-128.png',
      scale: 0.5,
    },
  },
}); // */

const segunda = new Generic({
  point: {
    icon: {
      src: 'https://ws058.juntadeandalucia.es/geoserver/styles/geoportal-cips/iconos/sistema_de_proteccion_menores/centrodia_menores.png',
      scale: 0.5,
    },
  },
});
const tercera = new Generic({
  point: {
    icon: {
      form: form.LOZENGE,
      gradient: true,
      fontsize: 0.8,
      radius: 20,
      color: 'blue',
      fill: '#8A0829',
      gradientcolor: '#088A85',
    },
  },
});

/* /
const cuarta = new Generic({
  point: {
    fill: { color: 'blue' },
    stroke: { color: 'pink', width: 2 },
  },
}); // */

const categoryStyle = new Category('categoria', {
  Primera: primera,
  Segunda: segunda,
  Tercera: tercera,
  // Cuarta: cuarta,
});

// Estilo para cluster
const clusterOptions = {
  ranges: [{
    min: 2,
    max: 4,
    style: new Generic({
      point: {
        stroke: { color: '#5789aa' },
        fill: { color: '#99ccff' },
        radius: 20,
      },
    }),
  }, {
    min: 5,
    max: 9,
    style: new Generic({
      point: {
        stroke: { color: '#5789aa' },
        fill: { color: '#3399ff' },
        radius: 30,
      },
    }),
  }, {
    min: 10,
    max: 15,
    style: new Generic({
      point: {
        stroke: { color: '#5789aa' },
        fill: { color: '#004c99' },
        radius: 40,
      },
    }),
  }],
  animated: true,
  hoverInteraction: true,
  displayAmount: true,
  distance: 80,
  maxFeaturesToSelect: 7,
};
const vendorParameters = {
  distanceSelectFeatures: 25,
  convexHullStyle: {
    fill: { color: '#000000', opacity: 0.5 },
    stroke: { color: '#000000', width: 1 },
  },
};
const clusterStyle = new Cluster(clusterOptions, vendorParameters);

window.setStyleCat = () => {
  campamentos.setStyle(categoryStyle);
};

window.setStyleCluster = () => {
  campamentos.setStyle(clusterStyle);
};

campamentos.setStyle(clusterStyle);

window.mapjs = mapjs;
