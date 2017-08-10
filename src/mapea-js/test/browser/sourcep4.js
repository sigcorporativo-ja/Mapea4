// cambiar AttributeName_


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
}, style2);

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
    "styleType": "religiosos"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
          -8.983428955078124,
          36.38761749978395
        ]
  }
}, style2);


let layer = new M.layer.Vector({
  name: 'layerVector'
});

mapajs.addLayers([layer]);
layer.addFeatures([feature, feature2, feature3, feature4]);

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

layer.setStyle(categoryStyle);

let res = categoryStyle.getStyleForCategories("privado");

/* EL resultado tiene que ser el Stylo de "privado" */
