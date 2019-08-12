import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StylePolygon from 'M/style/Polygon';
import StylePoint from 'M/style/Point';
import StyleCluster from 'M/style/Cluster';
import StyleCategory from 'M/style/Category';

const mapjs = map({
  'container': 'map',
  "controls": ["layerswitcher"]
});

var campamentos = new WFS({
  name: "Campamentos",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs",
  namespace: "sepim",
  name: "campamentos",
  geometry: 'POINT',
  extract: true
});
mapjs.addLayers(campamentos);

let reserva_st = new StylePolygon({
  fill: {
    color: 'rgb(223, 115, 255)'
  }
});
var reservas = new WFS({
  name: "reservas_biosfera",
  namespace: "reservas_biosfera",
  legend: "Reservas biosferas",
  geometry: "POLYGON",
  url: "https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_WFS_Patrimonio_Natural?",
  version: "1.1.0"
}, {
  getFeatureOutputFormat: 'geojson',
  describeFeatureTypeOutputFormat: 'geojson'
});
reservas.setStyle(reserva_st);
mapjs.addLayers(reservas);

mapjs.getFeatureHandler().removeLayer(reservas);

//Estilos para categorización
let categoryStyle = new StyleCategory("categoria", {
  "Primera": new StylePoint({
    icon: {
      src: 'https://image.flaticon.com/icons/svg/34/34697.svg',
      scale: 0.1
    },
  }),
  "Segunda": new StylePoint({
    icon: {
      src: 'https://image.flaticon.com/icons/svg/34/34651.svg',
      scale: 0.1
    },
  }),
  "Tercera": new StylePoint({
    icon: {
      src: 'https://image.flaticon.com/icons/svg/34/34654.svg',
      scale: 0.1
    },
  })
});

//Estilo para cluster
let clusterOptions = {
  ranges: [{
    min: 2,
    max: 4,
    style: new StylePoint({
      stroke: {
        color: '#5789aa'
      },
      fill: {
        color: '#99ccff',
      },
      radius: 20
    })
  }, {
    min: 5,
    max: 9,
    style: new StylePoint({
      stroke: {
        color: '#5789aa'
      },
      fill: {
        color: '#3399ff',
      },
      radius: 30
    })
  }, {
    min: 10,
    max: 15,
    style: new StylePoint({
      stroke: {
        color: '#5789aa'
      },
      fill: {
        color: '#004c99',
      },
      radius: 40
    })
  }],
  animated: true,
  hoverInteraction: true,
  displayAmount: true,
  distance: 80,
  maxFeaturesToSelect: 7
};
let vendorParameters = {
  distanceSelectFeatures: 25,
  convexHullStyle: {
    fill: {
      color: '#000000',
      opacity: 0.5
    },
    stroke: {
      color: '#000000',
      width: 1
    }
  }
}
let clusterStyle = new StyleCluster(clusterOptions, vendorParameters);


function setStyleCat() {
  campamentos.setStyle(categoryStyle);
}

function setStyleCluster() {
  campamentos.setStyle(clusterStyle);
}

campamentos.setStyle(clusterStyle);


window.mapjs = mapjs;
