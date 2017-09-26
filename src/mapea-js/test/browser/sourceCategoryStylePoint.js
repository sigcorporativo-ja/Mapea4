M.proxy(true);
var mapajs = M.map({
  'container': 'map',
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

let gato = new M.style.Point({

  radius: 5,
  icon: {
    src: 'https://cdn3.iconfinder.com/data/icons/free-icons-3/128/cat_6.png',
    rotation: 0.5,
    scale: 0.5,
    opacity: 0.8,
    anchor: [0.5, 1.9],
    anchororigin: 'top-left',
    anchororigin: 'top-left',
    anchorxunits: 'fraction',
    anchoryunits: 'fraction',
    rotate: false,
    // offset: [10, 0],
    crossorigin: null,
    snaptopixel: true,
    offsetorigin: 'bottom-left',
    size: [150, 95]
  }
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
});

var feature2 = new M.Feature('feature2', {
  "type": "Feature",
  "properties": {
    "colegio": "public"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [408685.7378,
      4069564.8875
    ]
  }
});

var feature3 = new M.Feature('feature3', {
  "type": "Feature",
  "properties": {
    "colegio": "concertado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [356797.6796,
      4138337.8894
    ]
  }
});

var feature4 = new M.Feature('feature4', {
  "type": "Feature",
  "properties": {
    "colegio": "privado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [259195.3268,
      4099100.7627
    ]
  }
});
var feature4 = new M.Feature('feature4', {
  "type": "Feature",
  "properties": {
    "colegio": "privado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [259195.3268,
      4099100.7627
    ]
  }
});
var feature5 = new M.Feature('feature5', {
  "type": "Feature",
  "properties": {
    "colegio": "concertado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [334236.6796,
      4135337.8894
    ]
  }
});

var feature6 = new M.Feature('feature6', {
  "type": "Feature",
  "properties": {
    "colegiosss": "60"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [394236.6796,
      4135337.8894
    ]
  }
});



var layer = new M.layer.Vector({
  name: 'layerVector'
});
var feature4 = new M.Feature('feature4', {
  "type": "Feature",
  "properties": {
    "colegio": "90"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [259195.3268,
      4099100.7627
    ]
  }
});
mapajs.addLayers([layer]);
layer.addFeatures([feature5, feature4, feature3, feature2, feature, feature6]);
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
  radius: 20

});
var azul = new M.style.Point({
  fill: {
    color: 'blue',
    width: 15
  },
  stroke: {
    color: 'black',
    width: 10
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
    width: 20
  },
  radius: 9
});


// constructor del mapa

var categoryStyle = new M.style.Category("colegio", {
  "public": amarillo,
  "privado": verde,
  "concertado": azul
});
layer.setStyle(categoryStyle);
let proportional = new M.style.Proportional('colegio', 4, 90, new M.style.Point({
  fill: {
    color: 'green',
    opacity: 0.5
  },
  stroke: {
    color: 'green'
  }
}));
// layer.setStyle(proportional);

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

let stylesPoint = [
      new M.style.Point({
    fill: {
      color: '33BBFF'
    },
    radius: 5
  }),
    new M.style.Point({
    fill: {
      color: '#FF0099'
    },
    radius: 6
  }),
    new M.style.Point({
    fill: {
      color: '#00AAAA'
    },
    radius: 7
  })
  ];
let choropleth = new M.style.Choropleth("colegio", stylesPoint, M.style.quantification.JENKS()); //M.style.quantification.JENKS() --> f(d, l = 6) --> f(d, 2)
// layer.setStyle(choropleth);

//
// var mapajs = M.map({
//   'container': 'map',
// });

// var feature = new M.Feature('feature', {
//   "type": "Feature",
//   "properties": {
//     "colegio": "public"
//   },
//   "geometry": {
//     "type": "Point",
//     "coordinates": [508241.7352,
//      4169727.5908
//    ]
//   }
// });
//
// var verde = new M.style.Point({
//   fill: {
//     color: 'green',
//     width: 15
//   },
//   stroke: {
//     color: 'black',
//     width: 2
//   },
//   radius: 9
// });
//
//
// var layer = new M.layer.Vector({
//   name: 'layerVector'
// });
//
// mapajs.addLayers([layer]);
// layer.addFeatures([feature]);
