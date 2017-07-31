//
// let mapajs = M.map({
//     container: "map",
//   }).addLayers(["WFST*CapaWFS*http://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero:prueba_lin_wfst*MLINE"])
//   .addLayers(["WFST*CapaWFS*http://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero:prueba_pun_wfst*MPOINT"])
//   .addLayers(["WFST*CapaWFS*http://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero:prueba_pol_wfst*MPOLYGON"]);
//


let mapajs = M.map({
  container: "map",
  controls: ['layerswitcher', 'overviewmap'],
}).addLayers(["WFST*CapaWFS*http://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero:prueba_pun_wfst*MPOINT"]).addPlugin(new M.plugin.AttributeTable());
