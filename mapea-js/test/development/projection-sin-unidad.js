import { map as Mmap } from 'M/mapea';

const map = Mmap({
  container: 'map',
  layers: [
    'WMS*Capa wms1*https://www.ideandalucia.es/wms/mta400r_2008?*MTA400*false', // window.map.setCenter({ x: 5379900, y: -718420 }); EPSG:25830*m // window.map.setCenter({"x": 37.410893299902995,"y": -4.537212680038807}) EPSG:4326*m
    'WMS*Redes*https://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas*true', // NO CONSIGO VISUALIZAR ESTA CAPA, window.map.setCenter([ -5.432434735351756, 37.050660932303664 ]); EPSG:4326*m  // window.map.setCenter([ 619741.2993196622, 4135642.3657173174 ]); EPSG:25830*m
  ],
  controls: ['layerSwitcher'],
  projection: 'EPSG:4326*m',
});

window.map = map;
