import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';
import { LOAD as LoadEvt } from 'M/event/eventtype';
import { GTE } from 'M/filter/Filter';

const mapjs = Mmap({
  container: 'map',
});

var layer = new WFS({
  url: "http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/grid/wfs?",
  namespace: "grid",
  name: "gridp_250",
  legend: "Grid",
  geometry: 'MPOLYGON',
  version: '2.0',
  cql: "cmun LIKE '%18005%'"
});

layer.on(LoadEvt, function() {
  mapjs.setBbox(layer.getFeaturesExtent());
});

mapjs.addWFS(layer);

window.setCQL = () => {
  layer.setCQL("cmun LIKE '%18006%'");
  // layer.setCQL("pob_tot gte 500");
};

window.filtrar = () => {
  let filterEqual = GTE("pob_tot", 50);
  layer.setFilter(filterEqual);
  mapjs.setBbox(layer.getFeaturesExtent());

};

window.limpiar = () => {
  layer.removeFilter();
  mapjs.setBbox(layer.getFeaturesExtent());
};

window.mapjs = mapjs;
