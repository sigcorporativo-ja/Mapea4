let mapajs = M.map({

  container: "mapjs",

  projection: "EPSG:3857*m",

  layers: ["OSM"],



  controls: ['layerswitcher', 'overviewmap', 'mouse'],

});

// let points = new M.layer.GeoJSON({
//
//   name: "Empresas",
//
//   url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/wfs?outputFormat=application/json&request=getfeature&typeNames=sepim:empresas&version=1.3.0",
//   //url: "http://192.168.60.189:8081/test/puntos.json",
//   extract: false
//
// });
//
// points.on(M.evt.ADDED_LAYER, function() {
//
//   alert("capa cargada");
//
// });
//
// mapajs.addLayers([points]);
//
// var options = {
//   ranges:
//
//   [
//     //   {
// //     min: 2,
// //     max: 49,
// //     style: new M.style.Point({
// //       fill: {
// //         color: 'red'
// //       },
// //       radius: 5
// //     })
// // },
// //   {
// //     min: 50,
// //     max: 100,
// //     style: new M.style.Point({
// //       fill: {
// //         color: 'blue'
// //       },
// //       radius: 10,
// //     })
// // },
// //   {
// //     min: 101,
// //     max: 12222,
// //     style: new M.style.Point({
// //       fill: {
// //         color: 'pink'
// //       },
// //       radius: 30
// //     })
// // }
//     ],
//
//   animated: true,
//
//   hoverInteraction: true,
//
//   displayAmount: true,
//
//   selectedInteraction: true,
//
//   distance: 20
//
// };
//
// var vendorParameters = {
//
//   displayInLayerSwitcherHoverLayer: true,
//
//   distanceSelectFeatures: 10
//
// }
//
// var style = new M.style.Cluster(options, vendorParameters);
//
//
//
//
//
//
//
// let verde = new M.style.Point({
//   fill: {
//     color: 'green'
//   },
//   stroke: {
//     color: 'green',
//     width: 1
//   },
//   radius: 6
// });
// let amarillo = new M.style.Point({
//   fill: {
//     color: 'yellow'
//   },
//   stroke: {
//     color: 'yellow',
//     width: 1
//   },
//   radius: 3
// });
// let rojo = new M.style.Point({
//   fill: {
//     color: 'red'
//   },
//   stroke: {
//     color: 'red',
//     width: 1
//   },
//   radius: 6
// });
// let azul = new M.style.Point({
//   fill: {
//     color: 'blue'
//   },
//   stroke: {
//     color: 'blue',
//     width: 1
//   },
//   radius: 21
// });
// let categoryStyle = new M.style.Category("sector", {
//   "Comercio": azul,
//   "Industria": rojo
//
// });
//
// let morado = new M.style.Point({
//   fill: {
//     color: 'blue'
//   },
//   stroke: {
//     color: 'blue',
//     width: 1
//   },
//   radius: 13
// });
//
//
// let stylesPoint = [
//     new M.style.Point({
//     fill: {
//       color: '33BBFF'
//     },
//     stroke: {
//       color: 'blue',
//       width: 1
//     },
//     radius: 5
//   }),
//   new M.style.Point({
//     fill: {
//       color: '#FF0099'
//     },
//     radius: 6
//   }),
//   new M.style.Point({
//     fill: {
//       color: '#00AAAA'
//     },
//     radius: 7
//   })
// ];
//
// let choropleth = new M.style.Choropleth("codmun", stylesPoint, M.style.quantification.JENKS()); //M.style.quantification.JENKS() --> f(d, l = 6) --> f(d, 2)
//
// function clusterf() {
//   points.setStyle(style);
// }
//
// function choroplethf() {
//   points.setStyle(choropleth);
// }
//
//
// function CategoryStylef() {
//   points.setStyle(categoryStyle);
// }
//
//
//
// function clusterf() {
//   points.setStyle(style);
// }
//
//
//
// // points.setStyle(style);
// //
// // points.setStyle(categoryStyle);
// //
// // points.setStyle(style);
// //
// // points.setStyle(categoryStyle);
//
// // points.setStyle(categoryStyle);
