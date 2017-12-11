var mapajs = M.map({
  container: 'map',
  controls: ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
});


var puntos = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda",
  legend: "centrosassda",
  getfeatureinfo: "plain",
  geometry: 'POINT',
  extract: true,
});

puntos.on(M.evt.LOAD, () => puntos.setStyle(stylePointInicial));


mapajs.addLayers([puntos]);

var nullStylePoint = new M.style.Point({});

let stylePointInicial = new M.style.Point({
  form: 'triangle',
  radius: 5,
  fill: {
    color: 'red',
    opacity: 1
  }
});


let stylePointTrabajo = new M.style.Point({
  form: 'triangle',
  radius: 10,
  fill: {
    color: 'red',
    opacity: 1,
    gradient: true
  },
  icon: {
    src: '',
    class: 'g-cartografia-save',
    size: 1,
    color: 'yellow'
  },
  'rotate': false,
  'rotation': 45
});





// Setea estilo a nivel de capa
function setStyleLayer(layer, style) {
  layer.setStyle(style);
}

//Setea estilo a nivel de feature
function setStyleFeature(feature, style) {
  feature.setStyle(style);
}

function set(element) {
  let style = puntos.getStyle();
  console.log(puntos.getStyle());
  style.set(element.id, element.value);
  let op = style.options_;
  console.log(op);
  puntos.setStyle(new M.style.Point(op));
  puntos.redraw();
}

function linedash(element) {
  let linedash = [element.value, element.value];
  let style = puntos.getStyle();
  style.set('linedash', linedash);
  let op = style.options_;
  puntos.setStyle(new M.style.Point(op));
}

function setText(element) {
  let style = puntos.getStyle();
  style.set(element.id, element.value);
  style.set('label.font', 'bold italic 19px Comic Sans MS');
  let op = style.options_;
  puntos.setStyle(new M.style.Point(op));
}
