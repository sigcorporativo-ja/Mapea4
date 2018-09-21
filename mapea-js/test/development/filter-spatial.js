import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';
import Feature from 'M/feature/Feature';
import { isNullOrEmpty } from 'M/util/Utils';
import { LIKE, AND, OR } from 'M/filter/Filter';
import { INTERSECT } from 'M/filter/Module';

const mapajs = map({
  container: 'map',
  controls: ['layerswitcher'],
});

/* eslint-disable */

var lyProvincias = new WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Provincias",
  geometry: 'MPOLYGON'
});
var miFeature = new Feature("featurePrueba002", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [263770.72265536943, 4085361.4590256726],
        [230910.00600234355, 4031901.3328427672],
        [288293.77947248437, 4017678.0840030923],
        [263770.72265536943, 4085361.4590256726]
      ]
    ]
  },
  "properties": {
    "nombre": "feature2"
  }
});
lyProvincias.addFeatures(miFeature);

mapajs.addLayers(lyProvincias);

function filtrar() {
  let filtroCapa = lyProvincias.getFilter();
  let nProv = prompt("Introduzca parte del nombre de la provincia", "Sevilla");
  let filter = LIKE("nombre", nProv);
  if (!isNullOrEmpty(filtroCapa)) {

    if (document.querySelector('#chkY')[0].checked) {
      filter = AND([filtroCapa, filter]);
    } else { // OR
      filter = OR([filtroCapa, filter]);
    }

  }
  lyProvincias.setFilter(filter);
}

function filtrarSpatial() {
  let filtroCapa = lyProvincias.getFilter();
  let filter = INTERSECT(miFeature);
  if (!isNullOrEmpty(filtroCapa)) {
    if (document.querySelector('#chkY')[0].checked) {
      filter = AND([filtroCapa, filter]);
    } else { // OR
      filter = OR([filtroCapa, filter]);
    }
  }
  lyProvincias.setFilter(filter);
}

function limpiar() {
  lyProvincias.removeFilter();
}

window.onload = () => {
  document.getElementById('filtrar').addEventListener('click', filtrar);
  document.getElementById('filtrarSpatial').addEventListener('click', filtrarSpatial);
  document.getElementById('limpiar').addEventListener('click', limpiar);
};
