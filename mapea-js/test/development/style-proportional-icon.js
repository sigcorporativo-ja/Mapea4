import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import StyleProportional from 'M/style/Proportional';
import StylePoint from 'M/style/Point';
import * as form from 'M/style/Form';

const mapajs = map({
  container: 'map',
  controls: ['layerswitcher', 'overviewmap'],
});

const indicadoresMun = new WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs?',
  namespace: 'tematicos',
  name: 'ind_mun_simp',
  geometry: 'POLYGON',
});

mapajs.addLayers(indicadoresMun);

function aplicar() {
  const sizeMin = document.getElementById('min').value;
  const sizeMax = document.getElementById('max').value;

  const proportionalVector = new StyleProportional('tot_ibi', sizeMin, sizeMax, new StylePoint({
    fill: {
      color: document.getElementById('relleno').value,
    },
    stroke: {
      color: document.getElementById('borde').value,
      width: 2,
    },
  }));

  // StyleProportional.SCALE_PROPORTION = 20;
  const proportionalIcon = new StyleProportional('tot_ibi', sizeMin, sizeMax, new StylePoint({
    icon: {
      src: 'https://cdn0.iconfinder.com/data/icons/citycons/150/Citycons_building-128.png',
      opacity: 0.8,
      anchor: [0.5, 0.5],
      rotate: false,
      snaptopixel: true,
    },
  }));

  const proportionalSymbol = new StyleProportional('tot_ibi', sizeMin, sizeMax, new StylePoint({
    icon: {
      form: form.LOZENGE,
      gradient: true,
      fontsize: 0.8,
      radius: 20,
      color: 'blue',
      fill: '#8A0829',
      gradientcolor: '#088A85',
    },
  }));

  switch (document.querySelector('input[name="tipo"]:checked').value) {
    case 'simple':
      indicadoresMun.setStyle(proportionalVector);
      break;
    case 'icono':
      indicadoresMun.setStyle(proportionalIcon);
      break;
    case 'symbol':
      indicadoresMun.setStyle(proportionalSymbol);
      break;
    default:
      break;
  }
}
window.mapjs = mapajs;
document.querySelector('#applyButton').onclick = aplicar;
