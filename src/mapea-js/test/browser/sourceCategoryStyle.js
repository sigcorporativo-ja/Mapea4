M.proxy(true);
var mapajs = M.map({
  'container': 'mapjs',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline"],
});

var style = new M.style.Point({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 2
});

var style2 = new M.style.Point({
  fill: {
    color: 'black'
  },
  stroke: {
    color: 'red',
    width: 1
  },
  radius: 3
});

var feature = new M.Feature('feature', {
  "type": "Feature",
  "properties": {
    "styleType": "privado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [308241.7352,
      4169727.5908
    ]
  }
}, style);

var feature2 = new M.Feature('feature2', {
  "type": "Feature",
  "properties": {
    "styleType": "public"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [408685.7378,
      4069564.8875
    ]
  }
}, style2);

var feature3 = new M.Feature('feature3', {
  "type": "Feature",
  "properties": {
    "styleType": "concertado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [356797.6796,
      4138337.8894
    ]
  }
}, style);

var feature4 = new M.Feature('feature4', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [259195.3268,
      4099100.7627
    ]
  }
}, style);

var feature5 = new M.Feature('feature5', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [408685.7378,
      4069564.8875
    ]
  }
}, style);

var layer = new M.layer.Vector({
  name: 'layerVector'
});

mapajs.addLayers([layer]);
layer.addFeatures([feature, feature2, feature3, feature4]);
//layer.addFeatures([feature5, feature4, feature3]);


var rojo = new M.style.Line({
  fill: {
    color: 'red',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 2
  },

  radius: 5

});

var amarillo = new M.style.Line({
  fill: {
    color: 'yellow',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 2
  },

  radius: 5
});

var rosa = new M.style.Line({
  fill: {
    color: 'pink',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 2

});
var azul = new M.style.Line({
  fill: {
    color: 'blue',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 5
});

var verde = new M.style.Line({
  fill: {
    color: 'green',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 5
});


// constructor del mapa

var categoryStyle = new M.style.Category("styleType", {
  "public": verde,
  "concertado": amarillo,
  "religiosos": rojo,
});


layer.setStyle(categoryStyle);


function constructor() {

  layer.setStyle(categoryStyle);

}

function GetStyleForCategories() {

  return categoryStyle.GetStyleForCategories();

}


function SetStyleForCategories(CategoryStyle, estilo) {

  return categoryStyle.setStyleForCategory(CategoryStyle, estilo);


}

function GetAttributeName() {

  return categoryStyle.GetAttributeName();

}

function SetAttributeName(AttributeName) {

  return categoryStyle.SetAttributeName(AttributeName);

}

function GetCategories() {

  return categoryStyle.getCategories();

}
