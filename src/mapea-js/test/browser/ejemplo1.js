// Caso de pruebas
// 1.- Carga de capa WFS - Polígono - Población -- Se aplicará Coropletas
// 2.- Carga de capa WFS - Polígonos - Municipios -- Se aplicará Categorías - por provincia
// 3.- Definición coropletas para Población
// 4.- Definición de categorías para Municipios por Provincia
// 5.- Aplicar clasificaciones
// 6.- Aplicar Cluster sobre las capas -- Esto no debe hacer nada o por lo menos que no provoque error.





var mapajs = M.map({
  'container': 'map',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
});




var municipios = new M.layer.WFS({
  name: "Municipios",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "da_municipio_pol",
  legend: "Municipios - CATEGORÍAS",
  getfeatureinfo: "plain",
  geometry: 'POLYGON',
  extract: true,
});


municipios.on(M.evt.LOAD, function() {
  municipios.setStyle(new M.style.Polygon({
    stroke: {
      color: 'red'
    }
  }));
})

// Establecemos categorías

let verde = new M.style.Polygon({
  fill: {
    color: 'green',
  },
  stroke: {
    color: 'black',
  }
});



let amarillo = new M.style.Polygon({
  fill: {
    color: 'yellow',
  },
  stroke: {
    color: 'black',
  }
});

let rojo = new M.style.Polygon({
  fill: {
    color: 'red',
  },
  stroke: {
    color: 'black',
  }
});


let azul = new M.style.Polygon({
  fill: {
    color: 'blue',
  },
  stroke: {
    color: 'black',
  }
});

let naranja = new M.style.Polygon({
  fill: {
    color: 'orange',
  },
  stroke: {
    color: 'black',
  }
});

let marron = new M.style.Polygon({
  fill: {
    color: 'brown',
  },
  stroke: {
    color: 'black',
  }
});

let magenta = new M.style.Polygon({
  fill: {
    color: '#e814d9',
  },
  stroke: {
    color: 'black',
  }
});

let morado = new M.style.Polygon({
  fill: {
    color: '#b213dd',
  },
  stroke: {
    color: 'black',
  }
});



let categoryStyle = new M.style.Category("nom_provincia", {
  "ALMERIA": marron,
  "CADIZ": amarillo,
  "CORDOBA": magenta,
  "GRANADA": verde,
  "JAEN": naranja,
  "MALAGA": azul,
  "SEVILLA": rojo,
  "HUELVA": morado
});




//
//
// var poblacion = new M.layer.WFS({
//         name: "Población",
//         url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
//    namespace: "mapea",
//    name: "nucleos_datos_poblacion",
//    legend: "nucleos_datos_poblacion - COROPLETAS",
// 	 getfeatureinfo:"plain",
//    geometry: 'POLYGON',
// 	 extract: true,
//       });
//
//
//  poblacion.on(M.evt.LOAD, function() {
//      poblacion.setStyle( new M.style.Polygon({
//         fill: {
//           color: 'blue',
//         }
//       }));
//  	}
//  )
//
//
// // Establecemos categorías para aplicar coropletas
//
//
// let stylesPolygon = [
//     new M.style.Polygon({
//     fill:{
//     color: 'cyan'
//     },
//      stroke: {
//       color: 'cyan',
//       width: 1
//      }
//   }),
//   new M.style.Polygon({
//   fill:{
//     color:  '#337CEB'
//     },
//      stroke: {
//       color: '#337CEB',
//       width: 1
//      }
//   }),
//   new M.style.Polygon({
//   fill:{
//     color: '#1f58ad'
//     },
//      stroke: {
//       color: '#1f58ad',
//       width: 1
//      }
//   }),
//   new M.style.Polygon({
//   fill:{
//     color: '#130668'
//     },
//      stroke: {
//       color: '#130668',
//       width: 1
//      }
//   })
// ];
//
// let choropleth = new M.style.Choropleth("poblacion", stylesPolygon, M.style.quantification.JENKS());




mapajs.addLayers(municipios);
// mapajs.addLayers(poblacion);




// mapajs.addPlugin(new M.plugin.AttributeTable());




// CONFIGURACIÓN PARÁMETROS CLUSTER
//
//  var options = {
//       ranges: [
//         /*{min:1, max:1, style: new M.style.Point({
//             fill: {
//               color: 'red'
//             },
//             radius: 15
//           })},*/
//
//         {
//           min: 2,
//           max: 3,
//           style: new M.style.Point({
// 					  stroke:  {
//                color: '#1306ce'
// 						},
//             fill: {
//               color: '#1306ce'
//             },
//             radius: 20
//           })
//         },
//         {
//           min: 3,
//           max: 5,
//           style: new M.style.Point({
// 					 stroke:  {
//                color: '#b3b532'
// 						},
//             fill: {
//               color: '#b3b532'
//             },
//             radius: 20
//           })
//         },
//         {
//           min: 5,
//           max: 10,
//           style: new M.style.Point({
// 					  stroke:  {
//                color: '#9519e5'
// 						},
//             fill: {
//               color: '#9519e5'
//             },
//             radius: 20
//           })
//         },
//         {
//           min: 10,
//           max: 15,
//           style: new M.style.Point({
// 						stroke:  {
//                color: '#5c623e'
// 						},
//             fill: {
//               color: '#5c623e'
//             },
//             radius: 20
//           })
//         },
//         {
//           min: 15,
//           max: 20,
//           style: new M.style.Point({
// 					  stroke:  {
//                color: '#2c35dd'
// 						},
//             fill: {
//               color: '#2c35dd'
//             },
//             radius: 20
//           })
//         },
//          {min:20, max:50000, style: new M.style.Point({
//               stroke:  {
//                  color: '#0d18e0'
// 						   },
// 							fill: {
// 							  color:'#0d18e0'
//                       },
//                       radius: 40
//                })}
//       ],
//       animated: true,
//       hoverInteraction: true,
//       displayAmount: true,
//       selectedInteraction: true,
//       distance: 80
//     };
//
//     var vendorParameters = {
//       displayInLayerSwitcherHoverLayer: true,
//       distanceSelectFeatures: 15
//     }



function setCategoriaStyle() {
  // if (poblacion == null) return;

  municipios.setStyle(categoryStyle);
  // poblacion.setStyle(choropleth);

}
//
// function setCluster(){
//   if (poblacion == null ) return;
//
//   poblacion.setStyle(new M.style.Cluster(options, vendorParameters));
// 	municipios.setStyle(new M.style.Cluster(options, vendorParameters));
//  }
