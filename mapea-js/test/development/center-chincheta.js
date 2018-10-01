import { map } from 'M/mapea';

const mapajs = map({
  container: 'map',
  wmcfiles: ['callejero'],
  zoom: 6,
  center: '235061.9,4141933.04',
  controls: ['layerSwitcher'],
});

function changeCenter() {
  mapajs.setCenter('235051.9,4040933.04*true');
}

document.querySelector('#button').onclick = changeCenter;
