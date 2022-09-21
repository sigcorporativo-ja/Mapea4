var mapajs = M.map({
  container: "map",
  controls: ["layerswitcher"],
  wmcfiles: ["mapa"]
});


var campamentos = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows",
  name: "sepim:campamentos",
  legend: "Campamentos",
  geometry: 'POINT',
  extract: true
});



let estiloPunto = new M.style.Point({
  radius: 5,
  fill: {
    color: 'orange',
    opacity: '0.8'
  },
  stroke: {
    color: 'red',
    width: 1,
    //linedash: [1, 20],
    // linedashoffset: 60,
    // linecap: 'square',
    // linejoin: 'miter',
    // miterlimit: 15
  },
  /*label: {
    text: function(feature) {
      return feature.getAttribute('nombre')
    },
    font: '10px Comic Sans MS',
    color: '#0000EE',
    rotate: false,
    scale: 1,
    offset: [0, 10],
    stroke: {
      color: 'yellow',
      width: 1
      //linedash: [1, 20],
      //linedashoffset: 60,
      //linecap: 'square',
      //linejoin: 'miter',
      //miterlimit: 15
    },
    rotation: 0,
    align: M.style.align.CENTER,
    baseline: M.style.baseline.TOP
  },*/
  //CASO ICON SRC
  icon: {
    src: 'http://mapea4-sigc.juntadeandalucia.es/assets/img/m-pin-24-sel.svg',
    rotation: 0,
    scale: 1,
    opacity: 0.8,
    anchor: [0.5, 1],
    //anchororigin: 'top-left',
    //anchorxunits: 'fraction',
    //anchoryunits: 'fraction',
    rotate: false,
    //offset: [10, 0],
    //crossorigin: null,
    //snaptopixel: true,
    //offsetorigin: 'bottom-left',
    //size:[10,10]
  },
  //CASO ICON FontSymbol
  /* icon: {
     form: M.style.form.BUBBLE,
     gradient: true,
     //class: "g-cartografia-alerta",
     //fontsize: 0.5,
     radius: 10,
     rotation:0,
     rotate: false,
     offset: [0, -12],
     //color: 'blue',
     fill: '#0000FF',
     gradientcolor: '#FF0000',
     opacity: 0.8
    }*/
});

campamentos.setStyle(estiloPunto);
mapajs.addLayers(campamentos);
