import { map as Mmap } from 'M/mapea';
import Polygon from 'M/style/Polygon';
import Line from 'M/style/Line';
import * as spatial from 'M/filter/Module';
import { AND, OR, NOT } from 'M/filter/Filter';

window.jsts = require('jsts/dist/jsts.min.js');

const m = Mmap({
  container: 'map',
  controls: ['layerswitcher', 'panzoom', 'navtoolbar'],
  wmcfiles: ['callejero'],
  layers: [
    'WFST*CapaWFS_POL*https://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?*tematicos:Provincias*MPOLYGON',
    'WFST*CapaWFS_POINT*https://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows*sepim:campamentos*POINT',
    'WFS*Lineas*https://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?*tematicos:Provincias*MLINE',
  ],
});

window.mapjs = m;

const estiloPolSel = new Polygon({
  fill: {
    color: 'blue',
    opacity: 0.2,
  },
  stroke: {
    color: 'cyan',
  },
});

// capa de poligonos
const pruebaPol = m.getWFS()[0];

// capa de puntos
const pruebaPun = m.getWFS()[1];
pruebaPol.setStyle(new Polygon({
  radius: 5,
  fill: {
    color: 'red',
  },
}));
// capa de lineas
const pruebaLin = m.getWFS()[2];
pruebaLin.setStyle(new Line({
  stroke: {
    color: 'red',
    width: 2,
  },
}));
window.filters = {
  removeFiltros() {
    // Revisar funcionamiento del filtro en referencia a los CQL
    // En principio se están creando por parejo
    pruebaPun.removeFilter();
    pruebaPun.setCQL();
    pruebaLin.removeFilter();
    pruebaLin.setCQL();
    pruebaPol.removeFilter();
    pruebaPol.setCQL();
  },

  // Intersecamos los features de puntos con el poligono superior izquierda
  // Le aplicamos el filtro solo a  los puntos
  intersectFilter() {
    const filtro = spatial.INTERSECT(pruebaPol.getFeatures()[1].getGeometry());
    pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
    pruebaPun.setFilter(filtro);
  },
  // disjointFilter() {
  //   // Diferencia de los features de lineas con el poligono superior izquierda
  //   // filtra todos aquellas lineas que no tengan interseccion con el poligono superior izquierda
  //   const filtro = spatial.DISJOINT(pruebaPol.getFeatures()[1].getGeometry());
  //   pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
  //   pruebaLin.setFilter(filtro);
  // },
  containFilter() {
    const filtro = spatial.CONTAIN(pruebaPun);
    pruebaPol.setFilter(filtro);
  },
  withinFilter() {
    const filtro = spatial.WITHIN(pruebaPol.getFeatures()[1].getGeometry());
    pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
    pruebaPun.setFilter(filtro);
  },
  intersectLayerFilter() {
    const filtro = spatial.INTERSECT(pruebaPol);
    pruebaPun.setFilter(filtro);
  },

  intersectLayerFilter2() {
    const filtro = spatial.INTERSECT(pruebaPol);
    pruebaLin.setFilter(filtro);
  },
  // INTERSECT CON CQL
  filterIntersectCQL() {
    const filtro = spatial.INTERSECT(pruebaPol.getFeatures()[1].getGeometry());
    pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
    pruebaPun.setCQL(filtro.toCQL());
  },

  // DISJOINT CON CQL
  filterDisjointCQL() {
    const filtro = spatial.DISJOINT(pruebaPol.getFeatures()[1].getGeometry());
    pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
    pruebaLin.setCQL(filtro.toCQL());
  },

  // CONTAIN CON CQL
  // Filtra aquellos puntos que contienen al poligono inf-izq (ninguno cumplira esto)
  filterContainCQL() {
    const filtro = spatial.CONTAIN(pruebaPol.getFeatures()[8].getGeometry());
    pruebaPol.getFeatures()[8].setStyle(estiloPolSel);
    pruebaPun.setCQL(filtro.toCQL());
  },

  // WITHIN CON CQL
  // Filtramos la capa puntos que esten contenidos en el poligono superior izquierda
  filterWithinCQL() {
    const filtro = spatial.WITHIN(pruebaPol.getFeatures()[1].getGeometry());
    pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
    pruebaPun.setCQL(filtro.toCQL());
  },

  // FEATURE COMO PARAMETRO
  // Esta funcion es para testear que no haga falta pasarle la geometría a la función
  filterFeatureComoParametro() {
    const filtro = spatial.INTERSECT(pruebaPol.getFeatures()[1]);
    pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
    pruebaPun.setCQL(filtro.toCQL());
  },

  // ARRAY DE FEATURES COMO PARAMETRO
  // Igual que antes pero pasandole una array de features (que siga funcionando igual)
  filterArrayComoParametro() {
    const filtro = spatial.INTERSECT(pruebaPol.getFeatures());
    pruebaPun.setCQL(filtro.toCQL());
  },

  // CAPA COMO PARAMETRO
  // Igual que antes pero pasandole una capa como parametro (que siga funcionando igual)
  filterCapaComoParametro() {
    const filtro = spatial.INTERSECT(pruebaPol);
    pruebaPun.setCQL(filtro.toCQL());
  },

  // FILTRO AND CON INTERSECT
  // lineas que intersecan con el poligono sup-izq e inf-izq
  filterIntersectAnd() {
    const filtro1 = spatial.INTERSECT(pruebaPol.getFeatures()[1].getGeometry());
    const filtro2 = spatial.INTERSECT(pruebaPol.getFeatures()[8].getGeometry());
    const filtroAND = AND([filtro1, filtro2]);

    pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
    pruebaPol.getFeatures()[8].setStyle(estiloPolSel);

    pruebaLin.setCQL(filtroAND.toCQL());
  },

  // FILTRO OR CON INTERSECT
  // Puntos que intersecan con el poligono sup-izq ó inf-izq
  filterIntersectOr() {
    const filtro1 = spatial.INTERSECT(pruebaPol.getFeatures()[1].getGeometry());
    const filtro2 = spatial.INTERSECT(pruebaPol.getFeatures()[8].getGeometry());

    pruebaPol.getFeatures()[1].setStyle(estiloPolSel);
    pruebaPol.getFeatures()[8].setStyle(estiloPolSel);

    const filtroOR = OR([filtro1, filtro2]);
    pruebaPun.setCQL(filtroOR.toCQL());
  },

  // FILTRO NOT CON INTERSECT
  // Filtrará aquellas lineas que no intersequen con el poligono inf-dech
  filterIntersectNot() {
    const filtro = spatial.INTERSECT(pruebaPol.getFeatures()[1].getGeometry());
    const filtroNOT = NOT(filtro);
    pruebaLin.setCQL(filtroNOT.toCQL());
  },
  disjointFilter() {
    const filtro = spatial.DISJOINT(pruebaPun);
    pruebaPol.setFilter(filtro);
  },
};
