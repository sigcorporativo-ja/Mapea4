import { map as Mmap } from 'M/mapea';

const mapjs = Mmap({
  container: 'map',
  wmc: ['callejeroCacheado'],
  // layers: ['WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Permeabilidad_Andalucia?'], // ERROR 404
  layers: ['WMS_FULL*https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_zona_peligro_incendios_forestales?*true'],
  // layers: ['WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Edad_Geologica_Andalucia?*true'], // Long wait before shown with colors
  center: [353200, 4125400],
});

window.mapjs = mapjs;
