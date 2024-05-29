import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StylePolygon from 'M/style/Polygon';
import StylePoint from 'M/style/Point';
import StyleCluster from 'M/style/Cluster';
import StyleCategory from 'M/style/Category';

const mapjs = map({
  container: 'map',
  controls: ['layerswitcher'],
});

const campamentos = new WFS({
  name: 'campamentos',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs',
  namespace: 'sepim',
  geometry: 'POINT',
  extract: true,
});
mapjs.addLayers(campamentos);

const reservaST = new StylePolygon({ fill: { color: 'rgb(223, 115, 255)' } });
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
mapjs.addLayers(reservas);

mapjs.getFeatureHandler().removeLayer(reservas);

// Estilos para categorización
const categoryStyle = new StyleCategory('categoria', {
  Primera: new StylePoint({
    icon: {
      // src: 'https://image.flaticon.com/icons/svg/34/34697.svg',
      src: 'https://raw.githubusercontent.com/VectorLogoZone/vectorlogozone/b16a80dc8527670a8bc79fe4f80ff33435b8606c/www/logos/google/google-icon.svg',
      scale: 0.1,
    },
  }),
  Segunda: new StylePoint({
    icon: {
      // src: 'https://image.flaticon.com/icons/svg/34/34651.svg',
      src: 'https://raw.githubusercontent.com/VectorLogoZone/vectorlogozone/b16a80dc8527670a8bc79fe4f80ff33435b8606c/www/logos/adobe/adobe-icon.svg',
      scale: 0.1,
    },
  }),
  Tercera: new StylePoint({
    icon: {
      // src: 'https://image.flaticon.com/icons/svg/34/34654.svg',
      src: 'https://raw.githubusercontent.com/VectorLogoZone/vectorlogozone/b16a80dc8527670a8bc79fe4f80ff33435b8606c/www/logos/apple/apple-icon.svg',
      scale: 0.1,
    },
  }),
});

// Estilo para cluster
const clusterOptions = {
  ranges: [{
    min: 2,
    max: 4,
    style: new StylePoint({
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
    style: new StylePoint({
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
    style: new StylePoint({
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
const clusterStyle = new StyleCluster(clusterOptions, vendorParameters);

window.setStyleCat = () => {
  campamentos.setStyle(categoryStyle);
};

window.setStyleCluster = () => {
  campamentos.setStyle(clusterStyle);
};

campamentos.setStyle(clusterStyle);

window.mapjs = mapjs;
