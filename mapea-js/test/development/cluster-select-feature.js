import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import Polygon from 'M/style/Polygon';
import Point from 'M/style/Point';
import Category from 'M/style/Category';
import Cluster from 'M/style/Cluster';
import Clustered from 'M/feature/Clustered';
import { LOAD as LoadEvt, SELECT_FEATURES as SelectFeaturesEvt } from 'M/event/eventtype';

const mapjs = Mmap({
  container: 'map',
});

const campamentos = new WFS({
  name: 'campamentos',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs',
  namespace: 'sepim',
  geometry: 'POINT',
  extract: true,
});
mapjs.addLayers(campamentos);
const reservaST = new Polygon({
  fill: {
    color: 'rgb(223, 115, 255)',
  },
});
const reservas = new WFS({
  name: 'reservas_biosfera',
  namespace: 'reservas_biosfera',
  legend: 'Reservas biosferas',
  geometry: 'POLYGON',
  url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_WFS_Patrimonio_Natural?',
  version: '1.1.0',
}, {
  getFeatureOutputFormat: 'geojson',
  describeFeatureTypeOutputFormat: 'geojson',
});
reservas.setStyle(reservaST);
reservas.on(LoadEvt, () => {
  const divElem = document.createElement('div');
  divElem.id = 'reservasLoaded';
  divElem.style.display = 'none';
  document.body.appendChild(divElem);
});
mapjs.addLayers(reservas);
mapjs.getFeatureHandler().removeLayer(reservas);
campamentos.on(SelectFeaturesEvt, (features, evt) => {
  if (features[0] instanceof Clustered) {
    console.log('Es un cluster:', features[0].getAttribute('features'));
  } else {
    console.log('NO es un cluster:', features);
  }
});

// Estilos para categorización
const primera = new Point({
  icon: {
    // src: 'https://image.flaticon.com/icons/svg/34/34697.svg',
    src: 'https://raw.githubusercontent.com/VectorLogoZone/vectorlogozone/b16a80dc8527670a8bc79fe4f80ff33435b8606c/www/logos/google/google-icon.svg',
    scale: 0.1,
  },
});
const segunda = new Point({
  icon: {
    // src: 'https://image.flaticon.com/icons/svg/34/34651.svg',
    src: 'https://raw.githubusercontent.com/VectorLogoZone/vectorlogozone/b16a80dc8527670a8bc79fe4f80ff33435b8606c/www/logos/adobe/adobe-icon.svg',
    scale: 0.1,
  },
});
const tercera = new Point({
  icon: {
    // src: 'https://image.flaticon.com/icons/svg/34/34654.svg',
    src: 'https://raw.githubusercontent.com/VectorLogoZone/vectorlogozone/b16a80dc8527670a8bc79fe4f80ff33435b8606c/www/logos/apple/apple-icon.svg',
    scale: 0.1,
  },
});
const categoryStyle = new Category('categoria', {
  Primera: primera,
  Segunda: segunda,
  Tercera: tercera,
});

// Estilo para cluster
const clusterOptions = {
  ranges: [{
    min: 2,
    max: 4,
    style: new Point({
      stroke: {
        color: '#5789aa',
      },
      fill: {
        color: '#99ccff',
      },
      radius: 20,
    }),
  }, {
    min: 5,
    max: 9,
    style: new Point({
      stroke: {
        color: '#5789aa',
      },
      fill: {
        color: '#3399ff',
      },
      radius: 30,
    }),
  }, {
    min: 10,
    max: 15,
    style: new Point({
      stroke: {
        color: '#5789aa',
      },
      fill: {
        color: '#004c99',
      },
      radius: 40,
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
    fill: {
      color: '#000000',
      opacity: 0.5,
    },
    stroke: {
      color: '#000000',
      width: 1,
    },
  },
};
const clusterStyle = new Cluster(clusterOptions, vendorParameters);
campamentos.setStyle(clusterStyle);

window.setStyleCat = () => {
  campamentos.setStyle(categoryStyle);
};

window.mapjs = mapjs;
