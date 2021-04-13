import { map as Mmap } from 'M/mapea';
import * as Utils from 'M/util/Utils';
import GeoJSON from 'M/layer/GeoJSON';
import Point from 'M/style/Point';

const mapa = Mmap({
  container: 'map',
  // controls: ['layerswitcher'],
  layers: ['WMTS*https://www.ideandalucia.es/geowebcache/service/wmts?*orto_2010-11*false']
});
