// constructor del mapa
let mapajs = M.map({
  container: "map",
  projection: "EPSG:3857*m",
  layers: ["OSM"],
  center: {
    x: -5.9584180843195425,
    y: 37.36912689160224
  },
  zoom: 5,
  controls: ['layerswitcher', 'overviewmap'],
});

let style = new M.style.Point({
  fill: {
    color: 'red'
  },
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


let points = new M.layer.GeoJSON({
  name: "Empresas",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/wfs?outputFormat=application/json&request=getfeature&typeNames=sepim:empresas&version=1.3.0",
  extract: false
}, {
  style: style
});

mapajs.addLayers([points]);


function removeStyle() {
  points.setStyle(null);
}
