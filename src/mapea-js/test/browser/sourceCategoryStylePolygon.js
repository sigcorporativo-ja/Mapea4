M.proxy(true);
var mapajs = M.map({
  'container': 'mapjs',
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

let feature4 = new M.Feature('feature4', {
  "type": "Feature",
  "properties": {
    "styleType": "hibridos"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [228296.0895, 4048092.4979],
        [259195.3268, 4049073.4201],
        [244971.8684, 4014250.4761],

      ]
    ]
  }
}, style);



let layer = new M.layer.Vector({
  name: 'layerVector'
});

mapajs.addLayers([layer]);
layer.addFeatures([feature, feature2, feature3, feature5, feature4]);

//layer.addFeatures([feature, feature2, feature3, feature4]);

let rojo = new M.style.Polygon({
  stroke: {
    color: '#C8FE2E',
    width: 15,
    linedash: [1, 20],
    linedashoffset: 60,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15
  },
  label: {
    text: 'FEATURE',
    font: 'bold italic 19px Comic Sans MS',
    rotate: false,
    scale: 0.9,
    offset: [10, 20],
    color: '#2EFEC8',
    stroke: {
      color: '#C8FE2E',
      width: 15,
      linedash: [1, 20],
      linedashoffset: 60,
      linecap: 'square',
      linejoin: 'miter',
      miterlimit: 15
    },
    rotation: 0.5,
    align: M.style.align.RIGHT,
    baseline: M.style.baseline.TOP
  },
  fill: {
    color: '#6A0888',
    opacity: 0.5,
    pattern: {
      name: M.style.pattern.HATCH,
      size: 6,
      spacing: 20,
      rotation: 3,
      offset: [50, 30],
      color: 'red',
      fill: {
        color: 'blue',
        opacity: 0.5
      },
      scale: 2
    }
  }
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
    width: 1
  },

});


var categoryStyle = new M.style.Category("styleType", {
  "public": verde,
  "privado": azul,
  "religiosos": rojo
});


layer.setStyle(categoryStyle);




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
