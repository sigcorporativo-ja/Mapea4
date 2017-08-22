M.proxy(true);
var mapajs = M.map({
  'container': 'mapajs',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline"],
});


let points = new M.layer.GeoJSON({
  name: "Empresas",
  url: "http://192.168.60.226:8081/test/puntos.json",

});

mapajs.addLayers([points]);


let azul = new M.style.Point({
  fill: {
    color: 'blue',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 20
  },

});




let categoryStyle = new M.style.Category("sector", {
  "Comercio": azul

});
