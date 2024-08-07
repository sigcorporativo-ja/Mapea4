import { map as Mmap, proxy } from 'M/mapea';
import MVT from 'M/layer/MVT';

proxy(false);
const mapjs = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['mouse'],
  layers: ['OSM'],
  ticket: 'PWUMZ5MQTPUGAEWTHCXVXSFZLLAKXUNKBQSTBOVVUIDYTPVPUK3Q3UZNNIV3HB6JTIFBCNXB3PJIGPKARGK5HLKV5CXQ4J62FEXTGWHYJG3BHFLETUSVDLRYDVB2SL4WNYTQMGVGFGBMVGM4QJ5H4FFH34WF6SJNEG5FNGY',
});

const mvt = new MVT(
  {
    url: 'https://hcsigc-geoserver-sigc.desarrollo.guadaltel.es/geoserver/gwc/service/tms/1.0.0/Global:superadministradortest_oficinas_sae_prueba_1717413455725@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
    name: 'vectortile',
    projection: 'EPSG:3857',
  },
  /* /
  {},
  {
    tileLoadFunction: () => {
      console.log('loading tile mvt');
    },
  }, // */
);

mvt.on('added:map', () => {
  console.log('mvt añadido');
});
mapjs.addLayers(mvt);
window.mapjs = mapjs;
