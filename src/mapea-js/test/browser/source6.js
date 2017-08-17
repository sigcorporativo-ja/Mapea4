M.proxy(true);
var mapajs = M.map({
  'container': 'map',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline"],
});


let style = new M.style.Polygon({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'black',
    width: 2
  },

});

let style2 = new M.style.Polygon({
  fill: {
    color: 'yellow'
  },
  stroke: {
    color: 'black',
    width: 2
  },

});

let style3 = new M.style.Polygon({
  fill: {
    color: 'pink'
  },
  stroke: {
    color: 'black',
    width: 2
  },

});




let feature = new M.Feature('feature', {
  "type": "Feature",
  "properties": {
    "styleType": "public"
  },
  "geometry": {
    "type": "Polygon",

    "coordinates": [
      [
        [296961.0613, 4238337.8894],
        [329822.1549, 4054495.9951],
        [279822.1549, 4154495.9951],
      ]
    ]
  }
}, style);

let feature2 = new M.Feature('feature2', {
  "type": "Feature",
  "properties": {
    "styleType": "concertado"
  },
  "geometry": {
    "type": "Polygon",

    "coordinates": [
      [
        [476961.3802, 4190327.0824],
        [439822.1549, 4154495.9951],
        [509448.9020, 4135936.8778],

      ]
    ]
  }
}, style2);

let feature3 = new M.Feature('feature3', {
  "type": "Feature",
  "properties": {
    "styleType": "privado"
  },
  "geometry": {
    "type": "Polygon",

    "coordinates": [
      [
        [349931.1824, 4239373],
        [412710.5852, 4236921.1703],
        [391130.1635, 4173651.3035],

      ]
    ]
  }
}, style3);


let feature5 = new M.Feature('feature5', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [362192.7844, 4117738.3979],
        [421048.4746, 4117738.3979],
        [397015.7345, 4078501.2712],

      ]
    ]
  }
}, style);


let layer = new M.layer.Vector({
  name: 'layerVector'
});

mapajs.addLayers([layer]);
layer.addFeatures([feature, feature2, feature3, feature5]);



/*
let catStyle = new M.style.Category('styleType', {
  catStyle.setStyleForCategory('publico', style);
  catStyle.setStyleForCategory('privado', style2);
});
*/

// constructor del mapa


let rojo = new M.style.Polygon({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'black',
    width: 2
  },

});

let amarillo = new M.style.Polygon({
  fill: {
    color: 'yellow'
  },
  stroke: {
    color: 'black',
    width: 2
  },

});

let rosa = new M.style.Polygon({
  fill: {
    color: 'pink'
  },
  stroke: {
    color: 'black',
    width: 2
  },

});

let azul = new M.style.Polygon({
  fill: {
    color: 'blue'
  },
  stroke: {
    color: 'black',
    width: 2
  },

});

let verde = new M.style.Polygon({
  fill: {
    color: 'green'
  },
  stroke: {
    color: 'black',
    width: 2
  },

});

/*
let catStyle = new M.style.Category('styleType', {
  catStyle.setStyleForCategory('publico', style);
  catStyle.setStyleForCategory('privado', style2);
});
*/

// constructor del mapa

let categoryStyle = new M.style.Category("styleType", {
  "public": verde,
  "concertado": verde,
  "privado": verde,
});


layer.setStyle(categoryStyle);
