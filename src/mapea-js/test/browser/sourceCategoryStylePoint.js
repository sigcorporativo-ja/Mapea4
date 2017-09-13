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
  radius: 10
});

var style2 = new M.style.Point({
  fill: {
    color: 'black'
  },
  stroke: {
    color: 'red',
    width: 1
  },
  radius: 20
});

var feature = new M.Feature('feature', {
  "type": "Feature",
  "properties": {
    "colegio": "public"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [508241.7352,
      4169727.5908
    ]
  }
}, style2);

var feature2 = new M.Feature('feature2', {
  "type": "Feature",
  "properties": {
    "colegio": "concertado"
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
    "colegio": "hibrido"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [356797.6796,
      4138337.8894
    ]
  }
}, style2);

var feature4 = new M.Feature('feature4', {
  "type": "Feature",
  "properties": {
    "colegio": "public"
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
    "colegio": "hibrido"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [334236.6796,
      4135337.8894
    ]
  }
}, style2);



var layer = new M.layer.Vector({
  name: 'layerVector'
});

mapajs.addLayers([layer]);
layer.addFeatures([feature5, feature4, feature3, feature2, feature]);
//layer.addFeatures([feature5, feature4, feature3]);


var rojo = new M.style.Point({
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

var amarillo = new M.style.Point({
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

var rosa = new M.style.Point({
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
var azul = new M.style.Point({
  fill: {
    color: 'blue',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 15
});

var verde = new M.style.Point({
  fill: {
    color: 'green',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 9
});


// constructor del mapa

var categoryStyle = new M.style.Category("colegio", {
  "public": rojo,
  "privado": verde,
  "religiosos": azul,
  "hibrido": amarillo,
  "concertado": rosa

});


// layer.setStyle(categoryStyle);
function GetStyleForCategories() {
  let CategoryStyle = document.getElementById('CategoryStyle').value;
  let res = categoryStyle.getStyleForCategories(CategoryStyle);
  console.log(res);

}


function SetStyleForCategories() {
  let CategoryStyle = document.getElementById('CategoryStyle').value;
  let res = categoryStyle.setStyleForCategories(CategoryStyle, azul);
  console.log(res);
}


function GetAttributeName() {
  let res = null;
  res = categoryStyle.getAttributeName();
  console.log(res);
}



function SetAttributeName() {
  let AttributeName = document.getElementById('AttributeName').value;
  let res = null;
  res = categoryStyle.setAttributeName(AttributeName);
  console.log(res);

}

function GetCategories() {
  let res = null;
  res = categoryStyle.getCategories();
  console.log(res);

}
