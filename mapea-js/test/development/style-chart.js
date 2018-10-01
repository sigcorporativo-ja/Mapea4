import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import Chart from 'M/style/Chart';
import { schemes } from 'M/chart/types';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs?",
  namespace: "tematicos",
  name: "provincias_pob_centroides",
  legend: "Provincias",
  geometry: 'POINT'
});

const stylechart = new Chart({
  type: 'donut',
  donutRatio: 0.3,
  radius: 25,
  stroke: {
    color: 'black',
    width: 1,
  },
  scheme: schemes.Custom,
  variables: [{
    attribute: 'd0_15_es',
    legend: '0-15 años',
    fill: '#F2F2F2',
    label: {
      stroke: {
        color: 'white',
        width: 2,
      },
      radiusIncrement: 10,
      fill: 'black',
      text: (value, values, feature) => {
        return value.toString();
      },
      font: 'Comic Sans MS',
    },
  }, {
    attribute: 'd16_45_es',
    legend: '16-45 años',
    fill: 'blue',
    label: {
      text: (value, values, feature) => {
        return value.toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#fff',
        width: 2,
      },
      fill: 'blue',
      font: 'Comic Sans MS',
    },
  }, {
    attribute: 'd45_65_es',
    legend: '45-65 años',
    fill: 'pink',
    label: {
      text: (value, values, feature) => {
        return value.toString();
      },
      stroke: {
        color: '#fff',
        width: 2,
      },
      fill: 'red',
      font: 'Comic Sans MS',
    },
  }, {
    attribute: 'd65_es',
    legend: '65 años o más',
    fill: 'orange',
    label: {
      text: (value, values, feature) => {
        return value.toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#fff',
        width: 2,
      },
      fill: '#886A08',
      font: 'Comic Sans MS',
    },
  }],
});

wfs.setStyle(stylechart);

window.layer = wfs;

mapjs.addWFS(wfs);
