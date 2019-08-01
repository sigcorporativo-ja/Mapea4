import { map as Mmap } from 'M/mapea';

const POINTS = [
  { center: [-5.9337, 37.3389], projection: 'EPSG:4326*d' },
  { center: [240103.69, 4136506.40], projection: 'EPSG:25830*m' },
  { center: [-660536.46, 4486450.94], projection: 'EPSG:3857*m' },
  { center: [-5.9337, 37.3389], projection: 'EPSG:4258*d' },
  { center: [240202.85, 4136708.95], projection: 'EPSG:23030*m' },
];
const ZOOM = 15;
const initCenter = POINTS[0].center;
const initProj = POINTS[0].projection;
const mapjs = Mmap({
  container: 'map',
  // layers: ['OSM'],
  // controls: ['layerswitcher', 'panzoom'],
  // projection: 'EPSG:4326*d',
  layers: [
    // 'WMS*Limites provinciales de Andalucia*http://www.ideandalucia.es/wms/mta400v_2008?*Division_Administrativa*false',
    'WMS*Ortofoto Andalucia 2013*http://www.ideandalucia.es/wms/ortofoto2013?*oca10_2013*false',
    // 'WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_modelo_altura_vege_incendio_la_granada_rio_tinto?*true',
    // 'WMS*Nucleos de Poblacion*http://www.ideandalucia.es/wms/mta100v_2005?*Nucleos_de_Poblacion*true',
    // 'WMS*Toponimia*http://www.ideandalucia.es/wms/mta100v_2005?*Toponimia_Nucleos_de_Poblacion*true',
  ],
  controls: ['layerswitcher', 'panzoom'],
  center: initCenter,
  projection: initProj,
  zoom: ZOOM,
});

window.mapjs = mapjs;
