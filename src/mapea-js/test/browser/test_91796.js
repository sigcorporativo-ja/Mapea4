var mapajs = M.map({
  'container': 'map',
  "layers": ['OSM'],
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline"],
  "center": [385325.7790260389, 4138808.9853899768],
  "zoom": 4
});

let defaultPoint = new M.style.Point({
  fill: {
    color: '#81c89a',
    opacity: 0.7
  },
  stroke: {
    color: '#6eb988',
    width: 2
  },
  radius: 8
})
let selectedPoint = new M.style.Point({
  fill: {
    color: '#ff5757',
    opacity: 0.7
  },
  stroke: {
    color: '#dc3e3e',
    width: 2
  },
  radius: 10
});
let hoverPoint = new M.style.Point({
  fill: {
    color: '#fdd523',
    opacity: 0.7
  },
  stroke: {
    color: '#fda823',
    width: 2
  },
  radius: 8
});
var centros = new M.layer.WFS({
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda_subtipo",
  legend: "Centros ASSDA",
  geometry: 'POINT',
  extract: true
});
centros.setStyle(defaultPoint);

let defaultPolygon = new M.style.Polygon({
  fill: {
    color: '#938fcf',
    opacity: 0.7
  },
  stroke: {
    color: '#827ec5',
    width: 2
  }
});
let selectedPolygon = new M.style.Polygon({
  fill: {
    color: '#ff5757',
    opacity: 0.7
  },
  stroke: {
    color: '#dc3e3e',
    width: 2
  }
});
let hoverPolygon = new M.style.Polygon({
  fill: {
    color: '#fdd523',
    opacity: 0.7
  },
  stroke: {
    color: '#fda823',
    width: 2
  }
});
let municipios = new M.layer.WFS({
  name: "Municipios",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "da_municipio_pol",
  legend: "Municipios",
  geometry: 'POLYGON'
});
municipios.setStyle(defaultPolygon);

mapajs.addLayers([municipios, centros]);

centros.on(M.evt.SELECT_FEATURES, features => features.forEach(f => f.setStyle(selectedPoint)));
centros.on(M.evt.UNSELECT_FEATURES, features => features.forEach(f => f.setStyle(defaultPoint)));
centros.on(M.evt.HOVER_FEATURES, features => features.forEach(f => f.setStyle(hoverPoint)));
centros.on(M.evt.LEAVE_FEATURES, features => features.forEach(f => f.setStyle(defaultPoint)));

municipios.on(M.evt.SELECT_FEATURES, features => features.forEach(f => f.setStyle(selectedPolygon)));
municipios.on(M.evt.UNSELECT_FEATURES, features => features.forEach(f => f.setStyle(defaultPolygon)));
municipios.on(M.evt.HOVER_FEATURES, features => features.forEach(f => f.setStyle(hoverPolygon)));
municipios.on(M.evt.LEAVE_FEATURES, features => features.forEach(f => f.setStyle(defaultPolygon)));
