let map = M.map({
  container: 'map',
  layers: ["OSM"],
  projection: "EPSG:4326*d",
  controls: ['layerswitcher']
});

var centros = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda",
  legend: "centrosassda",
  geometry: 'POINT',
});
map.addLayers(centros);

// let heatmap = new M.style.Heatmap("ss", {
//   gradient: ['red', 'blue'],
//   radius: 10,
//   blur: 15,
//   opacity: 1,
// });
let weights = [0, 0.1, 0.35, 0.2, 0.4];
centros.on(M.evt.LOAD, () => {
  centros.getFeatures().forEach(feature => feature.setAttribute('earthquake', weights[Math.round(Math.random() * 4)]));
  // centros.setStyle(heatmap);
});

const getValue = function(field) {
  return document.getElementById(field).value;
}

const domEls = {
  builder: document.querySelector('#style-builder'),
  toggleHandler: document.querySelector('#style-builder > .display-handler'),
  showButtonText: document.querySelector('#style-builder > .display-handler > span[data-role="show"]'),
  hideButtonText: document.querySelector('#style-builder > .display-handler > span[data-role="hide"]')
}

const eventHandlers = {
  toggleStyleBuilder: function() {
    if (domEls.builder.hasAttribute('opened')) {
      domEls.builder.removeAttribute('opened');
      domEls.showButtonText.className = '';
      domEls.hideButtonText.className = 'hidden';
    }
    else {
      domEls.builder.setAttribute('opened', true);
      domEls.hideButtonText.className = '';
      domEls.showButtonText.className = 'hidden';
    }
  },
  setStyle: function() {
    let attribute = getValue('attribute');
    let blursize = getValue('blursize');
    let radius = getValue('radius');
    let opacity = getValue('opacity');
    let gradient = getValue('gradient') || '#00f,#0ff,#0f0,#ff0,#f00';
    gradient = gradient.split(",");
    let heatmap = new M.style.Heatmap(attribute, {
      blursize: blursize,
      radius: 20,
      gradient: gradient
    });
    console.log(attribute, blursize, gradient, opacity, radius);
    centros.setStyle(heatmap);
  }
}
