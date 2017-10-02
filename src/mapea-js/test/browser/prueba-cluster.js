// Caso de pruebas
// 1.- Carga de capa WFS - Línea - Ríos -- Se aplicará Graduado
// 2.- Carga de capa WFS - Líneas - Carreteras -- Se aplicará Categorías
// 3.- Definición graduado para Ríos
// 4.- Definición de categorías para Carreteras
// 5.- Aplicar clasificaciones
// 6.- Aplicar Cluster sobre las capas -- Esto no debe hacer nada o por lo menos que no provoque error.





var mapajs = M.map({
  'container': 'map',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
});




var rios = new M.layer.WFS({
  name: "Ríos",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs",
  namespace: "mapea",
  name: "mapb_hs1_100",
  legend: "mapb_hs1_100 - COROPLETAS",
  getfeatureinfo: "plain",
  geometry: 'LINE',
  extract: true,
});


rios.on(M.evt.LOAD, function() {
  rios.setStyle(new M.style.Line({
    stroke: {
      color: 'blue',
      width: 5
    }
  }));
})


// Establecemos categorías para aplicar coropletas


let stylesLine = [
    new M.style.Line({
    stroke: {
      color: 'cyan',
      width: 1
    }
  }),
  new M.style.Line({
    stroke: {
      color: '#337CEB',
      width: 3
    }
  }),
  new M.style.Line({
    stroke: {
      color: '#1f58ad',
      width: 5
    }
  }),
  new M.style.Line({
    stroke: {
      color: '#130668',
      width: 8
    }
  })
];

let choropleth = new M.style.Choropleth("length", stylesLine, M.style.quantification.JENKS());



//****************************************************
// Definición de capa de carreteras
//****************************************************

var carreteras = new M.layer.WFS({
  name: "Carreteras",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "mapb_vc1_100",
  legend: "mapb_vc1_100 - CATEGORIAS",
  getfeatureinfo: "plain",
  geometry: 'LINE',
  extract: true,
});


carreteras.on(M.evt.LOAD, function() {
  carreteras.setStyle(new M.style.Line({
    stroke: {
      color: 'red',
      width: 5
    }
  }));
})


let naranja = new M.style.Line({
  stroke: {
    color: 'orange',
    width: 3
  }
});


let amarillo = new M.style.Line({
  stroke: {
    color: 'yellow',
    width: 2
  }
});

let rojo = new M.style.Line({
  stroke: {
    color: 'red',
    width: 5
  }
});


let azul = new M.style.Line({
  stroke: {
    color: 'blue',
    width: 1
  }
});


let categoryStyle = new M.style.Category("jerarquia", {
  "Red básica articulante": azul,
  "Red básica estructurante": azul,
  "Red complementaria": amarillo,
  "Red complementaria metropolitana": naranja,
  "Red de interés general del Estado": rojo,
  "Red de otros organismos": amarillo,
  "Red intercomarcal": amarillo,
  "Red provincial": naranja
});


mapajs.addLayers(rios);
mapajs.addLayers(carreteras);




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
        stroke: {
          color: '#1306ce'
        },
        fill: {
          color: '#1306ce'
        },
        radius: 20
      })
          },
    {
      min: 3,
      max: 5,
      style: new M.style.Point({
        stroke: {
          color: '#b3b532'
        },
        fill: {
          color: '#b3b532'
        },
        radius: 20
      })
          },
    {
      min: 5,
      max: 10,
      style: new M.style.Point({
        stroke: {
          color: '#9519e5'
        },
        fill: {
          color: '#9519e5'
        },
        radius: 20
      })
          },
    {
      min: 10,
      max: 15,
      style: new M.style.Point({
        stroke: {
          color: '#5c623e'
        },
        fill: {
          color: '#5c623e'
        },
        radius: 20
      })
          },
    {
      min: 15,
      max: 20,
      style: new M.style.Point({
        stroke: {
          color: '#2c35dd'
        },
        fill: {
          color: '#2c35dd'
        },
        radius: 20
      })
          },
    {
      min: 20,
      max: 50000,
      style: new M.style.Point({
        stroke: {
          color: '#0d18e0'
        },
        fill: {
          color: '#0d18e0'
        },
        radius: 40
      })
    }
        ],
  animated: true,
  hoverInteraction: true,
  displayAmount: true,
  selectedInteraction: true,
  distance: 80
};

var vendorParameters = {
  displayInLayerSwitcherHoverLayer: true,
  distanceSelectFeatures: 15
}




function setCategoriaStyle() {
  rios.setStyle(choropleth);
  carreteras.setStyle(categoryStyle);
}

function setCluster() {
  rios.setStyle(new M.style.Cluster(options, vendorParameters));
  carreteras.setStyle(new M.style.Cluster(options, vendorParameters));
}
