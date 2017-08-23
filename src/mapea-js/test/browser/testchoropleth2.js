//=============================================================================
//==================== TESTS DE M.style.Choropleth ============================
//========================   PARA CAPAS SERVIDAS   =============================
//=============================================================================

//================== RESUMEN DE DE LOS TEST ===================================
// 1. Aplicar estilo choropleth con estilos nulos y con cuantificador pasado por párametro
// a capa de puntos.(jenks, quantile)

// 2. Aplicar estilo choropleth con estilos definidos por el usuario
// y con cuantificador pasado por párametro a capa de puntos. (jenks, quantile)

// 3. Setear nuevos estilos de features a un M.style.Choropleth ya aplicado a una capa
// de puntos. (hace uso del quantification que ya tenia choropleth)

// 4. Setear nuevo quantification a un M.style.Choropleth ya aplicado a una capa
// de puntos (se hace uso de los estilos que ya tenia anteriormente Choropleth)

// Nota: En los test de setQuantification también se está comprobando que
// M.style.Choropleth funciona con cuantificadores definidos por usuario ademas
// de los predeterminados de M.style.quantification.

// 5. Setear nuevo attributeName a un M.style.Choropleth ya aplicado a una capa
// de puntos (se hace uso de los estilos y quantification que ya tenia anteriormente Choropleth).
// Esta función en principio debe cambiar los colores de la capa, ya que estamos usando un campo
// diferente para cuantificar. Solo se hace en capa de puntos, en lineas y poligonos es análogo.

// 6. Tests de todos los getters que tiene M.style.Choropleth. Estos getters devolverán
// la información por la consola del navegador.

//==============================================================================
//==============================================================================
var mapajs = new M.map({
  container: "map",
  layers: [
    new M.layer.WMS({
      url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
      name: 'Catastro',
      legend: 'Catastro',
      transparent: false,
      tiled: false
    })
  ],
  center: [211000, 4040000],
  zoom: 3
});


let points = new M.layer.GeoJSON({
  name: "Empresas",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/wfs?outputFormat=application/json&request=getfeature&typeNames=sepim:empresas&version=1.3.0"
});

//========================================================================
//== Test asíncrono para M.style.Choropleth ==============================
//========================================================================

let choropleth = new M.style.Choropleth('codpos', null, M.style.quantification.JENKS(4));
points.setStyle(choropleth);
mapajs.addLayers(points);

//=============================================================================
// Tes estilo por defecto =====================================================
//=============================================================================
function points_jenks() {
  let choropleth = new M.style.Choropleth('codpos', null, M.style.quantification.JENKS(numClass()));
  points.setStyle(choropleth);
}

function points_quantile() {
  let choropleth = new M.style.Choropleth('codpos', null, M.style.quantification.QUANTILE(numClass()));
  points.setStyle(choropleth);
}


//========================================================================
// Choropleth con styles introducidos por parametros
//========================================================================

function points_jenks2() {
  let stylesPoint = [
      new M.style.Point({
      fill: {
        color: '33BBFF'
      },
      radius: 5
    }),
    new M.style.Point({
      fill: {
        color: '#FF0099'
      },
      radius: 6
    }),
    new M.style.Point({
      fill: {
        color: '#00AAAA'
      },
      radius: 7
    })
  ];
  let choropleth = new M.style.Choropleth("codpos", stylesPoint, M.style.quantification.JENKS()); //M.style.quantification.JENKS() --> f(d, l = 6) --> f(d, 2)
  points.setStyle(choropleth);
}

function points_quantile2() {
  let stylesPoint = [
      new M.style.Point({
      fill: {
        color: '33BBFF'
      },
      radius: 5
    }),
    new M.style.Point({
      fill: {
        color: '#FF0099'
      },
      radius: 6
    }),
    new M.style.Point({
      fill: {
        color: '#00AAAA'
      },
      radius: 7
    })
  ];
  let choropleth = new M.style.Choropleth("codpos", stylesPoint, M.style.quantification.QUANTILE());
  points.setStyle(choropleth);
}


// ==============================================================================================
// === Test de choropleth para comprobar que se le puede setear estilos definidos por usuario
// === a un estilo ya asignado a una capa y se refresca el estilo
// ==============================================================================================
function points_setStyles() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    let styles = [
      new M.style.Point({
        fill: {
          color: 'blue'
        },
        radius: 5
      }),
      new M.style.Point({
        fill: {
          color: 'red'
        },
        radius: 8
      }),
      new M.style.Point({
        fill: {
          color: 'green'
        },
        radius: 10
      }),
      new M.style.Point({
        fill: {
          color: 'pink'
        },
        radius: 12
      })
    ];
    choropleth.setStyles(styles);
  }
}

// ===========================================================================
// Test de choropleth para comprobar que se le puede setear un cuantificador
// a un estilo ya asignado a una capa y se refresca el estilo
// ===========================================================================

function points_setQuantification() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    let quantification = function() {
      return [30000, 50000];
    };
    choropleth.setQuantification(quantification);
  }
}

// ==============================================================================
// Test para comprobar que al cambiar el atributo sobre el que realizar
// el choropleth map sobre un estilo choropleth ya asignado, el estilo se refresca
// ============================================================================


function points_setAttributeName() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    choropleth.setAttributeName("cnae2009");
  }
}

//==============================================================================
//============================= GETTERS ========================================
//==============================================================================
function getAttributeName() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    console.log(choropleth.getAttributeName());
  }
}

function getStyles() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    console.log(choropleth.getStyles());
  }
}

function getQuantification() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    console.log(choropleth.getQuantification());
  }
}

function getValues() {
  let choropleth = points.getStyle();
  if (!M.utils.isNullOrEmpty(choropleth)) {
    console.log(choropleth.getValues());
  }
}

//=============================================================================
// TEST Choropleth-Cluster ====================================================
// ============================================================================

function choropleth_cluster() {
  let options = {
    ranges: [
      ],
    animated: true,
    hoverInteraction: true,
    displayAmount: true,
    selectedInteraction: true,
    distance: 40
  };

  let optionsVendor = {
    displayInLayerSwitcherHoverLayer: false,
    distanceSelectFeatures: 15
  }
  let cluster = new M.style.Cluster(options, optionsVendor);
  let choropleth = new M.style.Choropleth('alumnos', null, M.style.quantification.JENKS(3));
  points.setStyle(choropleth);
  points.setStyle(cluster);
}

function numClass() {
  let numClases = document.getElementById('clases').value;
  numClases = numClases === "" ? 0 : parseInt(numClases);
  return numClases;
}
