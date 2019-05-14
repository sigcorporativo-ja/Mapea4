import { map as Mmap } from 'M/mapea';
// import WMS from 'M/layer/WMS';

const mapjs = Mmap({
  container: "map",
  layers: [
    "WMS*Municipios*http://www.ideandalucia.es/wms/dea100_divisiones_administrativas?*terminos_municipales*false*true",
    "WMS*Mapa*http://www.ideandalucia.es/services/andalucia/wms?*00_Mapa_Andalucia*true*false",
  ],
});


window.mapjs = mapjs;
