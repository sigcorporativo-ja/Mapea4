// ==========================================================================
// =============== Test styleproportional con capa servida ==================
// ==========================================================================

let mapajs = M.map({
  container: "map",
  projection: "EPSG:4326*m",
  layers: ["OSM"],
  center: [
    -6.39404296875,
    36.99377838872517
  ],
  zoom: 5,
  controls: ['layerswitcher', 'overviewmap'],
});

var centrosSubtipo = new M.layer.WFS({
  name: "Centros ASSDA - Subtipos",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda_subtipo",
  legend: "centrosassda_subtipo",
  geometry: 'POINT',
});

let stylePoint = new M.style.Point({
  fill: {
    color: 'yellow'
  }
});
let stylePoint2 = new M.style.Point({
  fill: {
    color: 'red',
    opacity: 0.6
  },
  stroke: {
    color: 'blue'
  }
});
let stylePoint3 = new M.style.Point({
  stroke: {
    color: '#C8FE2E',
    width: 15,
    linedash: [1, 20],
    linedashoffset: 60,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15
  }
});



// M.style.Proportional con radios bien definidos y estilo por defecto
let proportional = new M.style.Proportional('nregin', 4, 20, new M.style.Point({
  fill: {
    color: 'green',
    opacity: 0.5
  },
  stroke: {
    color: 'green'
  }
}));

// M.style.Proportional con radios mal introducidos y estilo por defecto.
// En este test se comprueba que el constructor se encarga de comprobar si
// minRadius < maxRadius y en caso contrario darle la vuelta a los valores
let proportional2 = new M.style.Proportional('nregin', 30, 20, new M.style.Point({
  stroke: {
    color: 'black'
  }
}));

// M.style.Proportional con radios bien definidos y estilo definido por usuario
// introducido por parámetro
let proportional3 = new M.style.Proportional('nregin', 10, 20, new M.style.Point({
  fill: {
    color: 'pink',
    opacity: 0.5
  },
  stroke: {
    color: 'purple'
  }
}));

// M.style.Proportional con atributo nulo. Al crear este estilo debe saltar un error.
try {
  let proportional4 = new M.style.Proportional(null, 4, 20);
}
catch (e) {
  console.log('Excepción capturada: Comprobación de atributo nulo funciona correctamente');
}

centrosSubtipo.on(M.evt.LOAD, () => centrosSubtipo.setStyle(proportional));
mapajs.addLayers([centrosSubtipo]);

function setProportional(stylePoint) {
  let styleProportional = centrosSubtipo.getStyle();
  styleProportional.setStyle(stylePoint);
}

function setMinRadio(element) {
  let style = centrosSubtipo.getStyle();
  style.setMinRadius(parseInt(element.value));

}

function setMaxRadio(element) {
  let style = centrosSubtipo.getStyle();
  style.setMaxRadius(parseInt(element.value));
}
