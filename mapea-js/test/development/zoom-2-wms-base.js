import { map as Mmap } from 'M/mapea';

const mapjs = Mmap({
  container: 'map',
  layers: [
    'WMS*Limites provinciales de Andalucia*http://www.ideandalucia.es/wms/mta400v_2008?*Division_Administrativa*false',
    'WMS*Ortofoto Andalucia 2013*http://www.ideandalucia.es/wms/ortofoto2013?*oca10_2013*false',
    'WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_modelo_altura_vege_incendio_la_granada_rio_tinto?*true',
    'WMS*Nucleos de Poblacion*http://www.ideandalucia.es/wms/mta100v_2005?*Nucleos_de_Poblacion*true',
    'WMS*Toponimia*http://www.ideandalucia.es/wms/mta100v_2005?*Toponimia_Nucleos_de_Poblacion*true',
  ],
  controls: ['layerswitcher', 'panzoom'],
  zoom: 5,
  // zoom: 0,
  center: [197028, 4182700],
});


window.mapjs = mapjs;
