var mapajs = M.map({
  'container': 'mapjs',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
});


var centros = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda",
  legend: "centrosassda",
  geometry: 'POINT',
});


var centrosSubtipo = new M.layer.WFS({
  name: "Centros ASSDA - Subtipos",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda_subtipo",
  legend: "centrosassda_subtipo",
  geometry: 'POINT',
});


mapajs.addLayers(centros);
mapajs.addLayers(centrosSubtipo);

// mapajs.addPlugin(new M.plugin.AttributeTable());
let estiloSubtipoDefPink = new M.style.Point({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'red',
    width: 5
  },
  radius: 15
});






let verde = new M.style.Point({
  fill: {
    color: 'green'
  },
  stroke: {
    color: 'green',
    width: 1
  },
  radius: 20
});
let amarillo = new M.style.Point({
  fill: {
    color: 'yellow'
  },
  stroke: {
    color: 'yellow',
    width: 1
  },
  radius: 13
});
let rojo = new M.style.Point({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'red',
    width: 1
  },
  radius: 13
});
let azul = new M.style.Point({
  fill: {
    color: 'blue'
  },
  stroke: {
    color: 'blue',
    width: 1
  },
  radius: 13
});

let categoryStyle = new M.style.Category("tipologia", {
  "CENTRO DE DÍA": verde,
  "CENTRO DE NOCHE": rojo,
  "CENTRO DE PARTICIPACIÓN ACTIVA DE PERSONAS MAYORES": rojo,
  "CENTRO DE SERVICIOS SOCIALES COMUNITARIOS": rojo,
  "CENTRO RESIDENCIAL": amarillo,
  "CENTRO SOCIAL": azul,
  "CENTRO SOCIOCULTURAL GITANO": azul,
  "COMEDOR": azul,
  "CONSULTAR A LA COORDINACIÓN": azul
});

let subtipologiaStyle = new M.style.Category("subtipologia", {
  "CENTRO DE DÍA": verde,
  "CENTRO DE DÍA OCUPACIONAL": verde,
  "CENTRO DE DÍA PARA PERSONAS CON AUTISMO": verde,
  "CENTRO DE DÍA PARA PERSONAS CON DAÑO CEREBRAL": verde,
  "CENTRO DE DÍA PARA PERSONAS CON DISCAPACIDAD FÍSICA": verde,
  "CENTRO DE DÍA PARA PERSONAS CON PARÁLISIS CEREBRAL": verde,
  "CENTRO DE DÍA PARA PERSONAS CON TRASTORNOS DE CONDUCTA": verde,
  "CENTRO DE ENCUENTRO Y ACOGIDA": verde,
  "CENTRO DE TRATAMIENTO AMBULATORIO": verde,
  "CENTRO DE TRATAMIENTO AMBULATORIO DE ATENCIÓN EXCLUSIVA AL JUEGO PATOLÓGICO": verde,
  "CENTRO DE NOCHE": rojo,
  "CENTRO DE PARTICIPACIÓN ACTIVA DE PERSONAS MAYORES": rojo,
  "CENTRO DE SERVICIOS SOCIALES COMUNITARIOS": rojo,
  "ALBERGUES PARA PERSONAS TRABAJADORAS TEMPORERAS": amarillo,
  "CASA": amarillo,
  "CASA DE ACOGIDA": amarillo,
  "CASA DE EMERGENCIA": amarillo,
  "CASA HOGAR": amarillo,
  "CENTRO DE ACOGIDA": amarillo,
  "CENTRO DE DESINTOXICACIÓN RESIDENCIAL": amarillo,
  "CENTRO RESIDENCIAL": amarillo,
  "COMUNIDAD TERAPÉUTICA": amarillo,
  "PISO TUTELADO": amarillo,
  "RESIDENCIA": amarillo,
  "RESIDENCIA DE PERSONAS CON AUTISMO": amarillo,
  "RESIDENCIA DE PERSONAS CON DISCAPACIDAD": amarillo,
  "RESIDENCIA DE PERSONAS CON DISCAPACIDAD FÍSICA": amarillo,
  "RESIDENCIA DE PERSONAS CON DISCAPACIDAD INTELECTUAL Y TRASTORNOS DE CONDUCTA": amarillo,
  "RESIDENCIA DE PERSONAS CON PARÁLISIS CEREBRAL": amarillo,
  "RESIDENCIA PARA PERSONAS ADULTAS (RA)": amarillo,
  "RESIDENCIA PARA PERSONAS MAYORES AUTÓNOMAS": amarillo,
  "RESIDENCIA PARA PERSONAS MAYORES CON TRASTORNOS DE CONDUCTA": amarillo,
  "RESIDENCIA PARA PERSONAS MAYORES EN SITUACIÓN DE DEPENDENCIA": amarillo,
  "VIVIENDA DE APOYO A LA REINSERCIÓN": amarillo,
  "VIVIENDA DE APOYO AL TRATAMIENTO": amarillo,
  "VIVIENDA SUPERVISADA": amarillo,
  "VIVIENDA TUTELADA": amarillo,
  "CENTRO SOCIAL": azul,
  "CENTRO SOCIOCULTURAL GITANO": azul,
  "COMEDOR": azul,
  "CONSULTAR A LA COORDINACIÓN": azul
});



// CONFIGURACIÓN PARÁMETROS CLUSTER

var options = {
  ranges: [
          /*{min:1, max:1, style: new M.style.Point({
              fill: {
                color: 'red'
              },
              radius: 15
            })},*/

    {
      min: 2,
      max: 3,
      style: new M.style.Point({
        fill: {
          color: 'green'
        },
        radius: 20
      })
          },
    {
      min: 3,
      max: 5,
      style: new M.style.Point({
        fill: {
          color: 'blue'
        },
        radius: 20
      })
          },
    {
      min: 5,
      max: 10,
      style: new M.style.Point({
        fill: {
          color: 'yellow'
        },
        radius: 20
      })
          },
    {
      min: 10,
      max: 15,
      style: new M.style.Point({
        fill: {
          color: 'orange'
        },
        radius: 20
      })
          },
    {
      min: 15,
      max: 2000,
      style: new M.style.Point({
        fill: {
          color: 'red'
        },
        radius: 20
      })
          }
          /* ,
                       {min:20, max:50000, style: new M.style.Point({
                         fill: {
                           color: 'black'
                         },
                         radius: 5
                       })}*/
        ],
  // animated: true,
  // hoverInteraction: true,
  // displayAmount: true,
  // selectedInteraction: true,
  // distance: 80
  animated: true,
  hoverInteraction: true,
  displayAmount: true,
  selectedInteraction: true,
  distance: 80
};




var vendorParameters = {
  // displayInLayerSwitcherHoverLayer: true,
  displayInLayerSwitcherHoverLayer: true,

  distanceSelectFeatures: 15
}

let cluster = new M.style.Cluster(options, vendorParameters);


function setCategoríaStyle() {
  centros.setStyle(categoryStyle);
}

function setCluster() {

  // let style_texto = new M.style.Point({
  //   fill: {
  //     color: 'blue',
  //     width: 15
  //   },
  //   label: {
  //     text: 'hola'
  //   },
  //   stroke: {
  //     color: 'blue',
  //     width: 1
  //
  //   },
  //   radius: 20
  // })
  //
  // centros.setStyle(style_texto);
  centros.setStyle(cluster);

}


function setSubtiposCategoríaStyle() {
  centrosSubtipo.setStyle(subtipologiaStyle);
}

function setClusterSubtipologia() {
  centrosSubtipo.setStyle(new M.style.Cluster(options, vendorParameters));
}
