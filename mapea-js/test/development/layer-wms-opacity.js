import { map } from 'M/mapea';

const mapajs = map({
  container: 'map',
  wmcfiles: ['callejero'],
  controls: ['layerswitcher'],
  layers: [
    'WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas*true',
  ],
});

function changeOpacity() {
  mapajs.getWMS('Redes_energeticas')[0].setOpacity(0.5);
}

document.querySelector('button').onclick = changeOpacity;

window.mapajs = mapajs;
