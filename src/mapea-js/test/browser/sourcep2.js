// applicar un estilo nuevo "setStyleForCategories"


let mapajs = M.map({
  container: "map",
  projection: "EPSG:3857*m",
  layers: ["OSM"],
  // center: {
  //   x: -5.9584180843195425,
  //   y: 37.36912689160224
  // },
  // zoom: 10,
  controls: ['layerswitcher', 'overviewmap'],
});

let style = new M.style.Point({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 2
});

let style2 = new M.style.Point({
  fill: {
    color: 'black'
  },
  stroke: {
    color: 'red',
    width: 1
  },
  radius: 3
});

let style3 = new M.style.Point({
  fill: {
    color: 'black'
  },
  stroke: {
    color: 'yellow',
    width: 1
  },
  radius: 3
});


var i;
var ramdom_x;
var ramdom_y;
var features = []

for (i = 0; i < 1500; i++) {

  ramdom_x = Math.random() * (10 - (-5) + 1);
  ramdom_y = Math.random() * (60 - 0 + 1);

  if (i % 7 == 0) {
    features.push(new M.Feature((i.toString()), {
      "type": "Feature",
      "properties": {
        "styleType": "hibrido"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
            ramdom_x,
            ramdom_y
          ]
      }
    }));
  }

  if (i % 3 == 0) {
    features.push(new M.Feature((i.toString()), {
      "type": "Feature",
      "properties": {
        "styleType": "religiosos"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
            ramdom_x,
            ramdom_y
          ]
      }
    }));
  }

  if (i % 13 == 0) {
    features.push(new M.Feature((i.toString()), {
      "type": "Feature",
      "properties": {
        "styleType": "bilingues"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
            ramdom_x,
            ramdom_y
          ]
      }
    }));
  }


  if (i % 2 == 0) {
    features.push(new M.Feature((i.toString()), {
      "type": "Feature",
      "properties": {
        "styleType": "privado"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
            ramdom_x,
            ramdom_y
          ]
      }
    }));
  }
  else {

    features.push(new M.Feature((i.toString()), {
      "type": "Feature",
      "properties": {
        "styleType": "concertado"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
            ramdom_x,
            ramdom_y
          ]
      }
    }));
  }




}




let layer = new M.layer.GeoJSON({
  name: "Empresas",
  url: "http://192.168.60.226:8081/test/puntos.json"

});


/*
let feature = new M.Feature('feature', {
  "type": "Feature",
  "properties": {
    "styleType": "privado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -3.983428955078124,
          30.38761749978395
        ]
  }
}, style);

let feature2 = new M.Feature('feature2', {
  "type": "Feature",
  "properties": {
    "styleType": "public"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -4.983428955078124,
          36.38761749978395
        ]
  }
}, style3);

let feature3 = new M.Feature('feature3', {
  "type": "Feature",
  "properties": {
    "styleType": "concertado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -1.983428955078124,
          36.38761749978395
        ]
  }
}, style2);

let feature4 = new M.Feature('feature4', {
  "type": "Feature",
  "properties": {
    "styleType": "concertado"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -1.983428955078124,
          20.38761749978395
        ]
  }
}, style3);

let feature5 = new M.Feature('feature5', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -10.983428955078124,
          16.38761749978395
        ]
  }
}, style2);

let feature6 = new M.Feature('feature6', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -8.983428955078124,
          20.38761749978395
        ]
  }
}, style3);

let feature7 = new M.Feature('feature7', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -4.983428955078124,
          25.38761749978395
        ]
  }
}, style2);

let feature8 = new M.Feature('feature8', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -6.983428955078124,
          29.38761749978395
        ]
  }
}, style3);

let feature9 = new M.Feature('feature9', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -8.983428955078124,
          32.38761749978395
        ]
  }
}, style2);

let feature10 = new M.Feature('feature10', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -7.983428955078124,
          30.38761749978395
        ]
  }
}, style3);

let feature11 = new M.Feature('feature11', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -3.983428955078124,
          36.38761749978395
        ]
  }
}, style2);

let feature12 = new M.Feature('feature12', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -4.983428955078124,
          36.38761749978395
        ]
  }
}, style3);

let feature13 = new M.Feature('feature13', {
  "type": "Feature",
  "properties": {
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -5.983428955078124,
          10.38761749978395
        ]
  }
}, style2);


let layer = new M.layer.Vector({
  name: 'layerVector'
});

mapajs.addLayers([layer]);
layer.addFeatures([feature, feature2, feature3, feature4, feature5, feature6, feature7, feature8, feature9
, feature10, feature11, feature12, feature13]);
*/
/*
let layer = new M.layer.Vector({
  name: 'layerVector'
});
mapajs.addLayers([layer]);

var p;
var f;
for (p = 0; p < 1500; p++) {
  f = features[p];
  layer.addFeatures(f);


}

*/

mapajs.addLayers([layer]);

let verde = new M.style.Point({
  fill: {
    color: 'green'
  },
  stroke: {
    color: 'green',
    width: 1
  },
  radius: 6
});
let amarillo = new M.style.Point({
  fill: {
    color: 'yellow'
  },
  stroke: {
    color: 'yellow',
    width: 1
  },
  radius: 3
});
let rojo = new M.style.Point({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'red',
    width: 1
  },
  radius: 6
});

let azul = new M.style.Point({
  fill: {
    color: 'blue'
  },
  stroke: {
    color: 'blue',
    width: 1
  },
  radius: 20
});





// constructor del mapa

let categoryStyle = new M.style.Category("sector", {
  "Comercio": azul

});


//layer.setStyle(categoryStyle);


//categoryStyle.setStyleForCategories("religiosos", azul);

/*EL resultado tendra que ser el cambio de la categoria "concertado" a style2
Por consiguiente tambien se tendra que cambiar la variable categoryStyles_*/
