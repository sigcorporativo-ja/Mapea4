var m = M.map({
  "controls": ["layerswitcher", "panzoom", "navtoolbar"],
  "wmcfiles": ["callejero"],
  "container": "map",
  "layers": [
    "WFST*CapaWFS_POL*https://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero:mapea_filtros_no_tocar*MPOLYGON",
    "WFST*CapaWFS_POINT*https://clientes.guadaltel.es/desarrollo/geossigc/wfs?*ggis:TEST_Geor_Inventario_cavidades*MPOINT",
    "WFS*Lineas*https://clientes.guadaltel.es/desarrollo/geossigc/wfs?*mapea:hs1_100_simplificada*MLINE"
  ]
});


var estiloPolSel = new M.style.Polygon({
  fill: {
    color: 'blue',
    opacity: 0.2
  },
  stroke: {
    color: 'cyan'
  }
});

// capa de poligonos
var prueba_pol_wfst = m.getWFS()[0];

// capa de puntos
var prueba_pun_wfst = m.getWFS()[1];
prueba_pun_wfst.setStyle(new M.style.Point({
  radius: 5,
  fill: {
    color: 'red'
  }
}));
// capa de lineas
var prueba_lin_wfst = m.getWFS()[2];
prueba_lin_wfst.setStyle(new M.style.Line({
  stroke: {
    color: 'orange',
    width: 2
  }
}));
// Elimina todos los filtros establecidos
function removeFiltros() {
  // Revisar funcionamiento del filtro en referencia a los CQL
  // En principio se están creando por parejo
  prueba_pun_wfst.removeFilter();
  prueba_pun_wfst.setCQL();
  prueba_lin_wfst.removeFilter();
  prueba_lin_wfst.setCQL();
  prueba_pol_wfst.removeFilter();
  prueba_pol_wfst.setCQL();
}



//INTERSECT

/// Intersecamos los features de puntos con el poligono superior izquierda
// Le aplicamos el filtro solo a  los puntos
function intersectFilter() {
  let filtro = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures()[1].getGeometry());
  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_pun_wfst.setFilter(filtro);
}

//DISJOINT

//Diferencia de los features de lineas con el poligono superior izquierda
// filtra todos aquellas lineas que no tengan interseccion con el poligono superior izquierda
function disjointFilter() {
  let filtro = M.filter.spatial.DISJOINT(prueba_pol_wfst.getFeatures()[1].getGeometry());
  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_lin_wfst.setFilter(filtro);
}


//

//CONTAIN

// Filtramos la capa puntos que contengan al poligono superior
// izquierda
/*function containFilter() {
  let filtro = M.filter.spatial.CONTAIN(prueba_pol_wfst.getFeatures()[1].getGeometry());
  prueba_pun_wfst.setFilter(filtro);
}*/

function containFilter() {
  let filtro = M.filter.spatial.CONTAIN(prueba_pun_wfst);
  prueba_pol_wfst.setFilter(filtro);
}


//WITHIN
// Filtramos la capa puntos que esten contenidos en el poligono superior izquierda
function withinFilter() {
  let filtro = M.filter.spatial.WITHIN(prueba_pol_wfst.getFeatures()[1].getGeometry());
  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_pun_wfst.setFilter(filtro);
}



//INTERSECT LAYER-LAYER - Está intersecando la layer de poligonos y la layer de puntos
// En casos anteriores lo haciamos con features.
function intersectLayerFilter() {
  let filtro = M.filter.spatial.INTERSECT(prueba_pol_wfst);
  prueba_pun_wfst.setFilter(filtro);
}

// Mismo caso que el ejemplo anterior pero probando con lineas y poligonos
function intersectLayerFilter2() {
  let filtro = M.filter.spatial.INTERSECT(prueba_pol_wfst);
  prueba_lin_wfst.setFilter(filtro);
}


// //INTERSECT CON CQL
function filterIntersectCQL() {
  let filtro = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures()[1].getGeometry());
  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_pun_wfst.setCQL(filtro.toCQL());
}


// //DISJOINT CON CQL
function filterDisjointCQL() {
  let filtro = M.filter.spatial.DISJOINT(prueba_pol_wfst.getFeatures()[1].getGeometry());
  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_lin_wfst.setCQL(filtro.toCQL());

}
//
//
// //CONTAIN CON CQL
// Filtra aquellos puntos que contienen al poligono inf-izq (ninguno cumplira esto)
function filterContainCQL() {
  let filtro = M.filter.spatial.CONTAIN(prueba_pol_wfst.getFeatures()[8].getGeometry());
  prueba_pol_wfst.getFeatures()[8].setStyle(estiloPolSel);
  prueba_pun_wfst.setCQL(filtro.toCQL());
}


//
//
// //WITHIN CON CQL
//// Filtramos la capa puntos que esten contenidos en el poligono superior izquierda
function filterWithinCQL() {
  filtro = M.filter.spatial.WITHIN(prueba_pol_wfst.getFeatures()[1].getGeometry());
  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_pun_wfst.setCQL(filtro.toCQL());
}
//

//
//
// //FEATURE COMO PARAMETRO
// Esta funcion es para testear que no haga falta pasarle la geometría a la función
function filterFeatureComoParametro() {
  filtro = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures()[1]);
  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_pun_wfst.setCQL(filtro.toCQL());
}

//
// //ARRAY DE FEATURES COMO PARAMETRO
// Igual que antes pero pasandole una array de features (que siga funcionando igual)
function filterArrayComoParametro() {
  let filtro = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures());
  prueba_pun_wfst.setCQL(filtro.toCQL());
}
//
//
// //CAPA COMO PARAMETRO
// Igual que antes pero pasandole una capa como parametro (que siga funcionando igual)
function filterCapaComoParametro() {
  let filtro = M.filter.spatial.INTERSECT(prueba_pol_wfst);
  prueba_pun_wfst.setCQL(filtro.toCQL());
}


// //FILTRO AND CON INTERSECT
// lineas que intersecan con el poligono sup-izq e inf-izq
function filterIntersectAnd() {
  let filtro1 = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures()[1].getGeometry());
  let filtro2 = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures()[8].getGeometry());
  let filtroAND = M.filter.AND([filtro1, filtro2]);

  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_pol_wfst.getFeatures()[8].setStyle(estiloPolSel);

  prueba_lin_wfst.setCQL(filtroAND.toCQL());
}
//
//
// //FILTRO OR CON INTERSECT

// // Puntos que intersecan con el poligono sup-izq ó inf-izq
function filterIntersectOr() {
  filtro1 = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures()[1].getGeometry());
  filtro2 = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures()[8].getGeometry());

  prueba_pol_wfst.getFeatures()[1].setStyle(estiloPolSel);
  prueba_pol_wfst.getFeatures()[8].setStyle(estiloPolSel);

  filtroOR = M.filter.OR([filtro1, filtro2]);
  prueba_pun_wfst.setCQL(filtroOR.toCQL());
}
//
//
// //FILTRO NOT CON INTERSECT
// Filtrará aquellas lineas que no intersequen con el poligono inf-dech
function filterIntersectNot() {
  filtro = M.filter.spatial.INTERSECT(prueba_pol_wfst.getFeatures()[1].getGeometry());
  filtroNOT = M.filter.NOT(filtro);
  prueba_lin_wfst.setCQL(filtroNOT.toCQL());

}
