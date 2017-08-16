// aplicar categoryStyles a la capa


let mapajs = M.map({
  container: "map",
  projection: "EPSG:4326*d",
  layers: ["OSM"],
  // center: {
  //   x: -5.9584180843195425,
  //   y: 37.36912689160224
  // },
  // zoom: 10,
  controls: ['layerswitcher', 'overviewmap'],
});


let Polygon = new M.style.Polygon({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'black',
    width: 2
  },
  radius: 2
});



let feature = new M.Feature('feature', {
  "type": "Feature",
  "properties": {
    "styleType": "privado"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [308241.7352,
      4169727.5908
    ]
  }
}, style);



mapajs.addLayers([layer]);
layer.addFeatures([feature]);

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
  radius: 6
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
  "concertado": amarillo,
  "privado": rojo,
});
