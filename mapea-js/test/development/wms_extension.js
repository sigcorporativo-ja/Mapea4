import { map as Mmap } from 'M/mapea';
// import WMS from 'M/layer/WMS';

const mapjs = Mmap({
  container: 'map',
  layers: [
    'WMS*Municipios*https://www.ideandalucia.es/wms/dea100_divisiones_administrativas?*terminos_municipales*true*true',
    'WMS*Mapa*https://www.ideandalucia.es/services/andalucia/wms?*00_Mapa_Andalucia*true*false',
  ],
});

window.mapjs = mapjs;
