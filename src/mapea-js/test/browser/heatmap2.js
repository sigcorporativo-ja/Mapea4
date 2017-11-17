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

let heatmap = new M.style.Heatmap('earthquake', {
  gradient: ['red', 'blue', 'green', 'pink', 'yellow'],
  radius: 10,
  blur: 15,
});

let weights = [0, 0.1, 0.35, 0.2, 0.4, 0.55, 0.7, 0.9, 1];
centros.on(M.evt.LOAD, () => {
  centros.getFeatures().forEach(feature => feature.setAttribute('earthquake', weights[Math.round(Math.random() * 9)]));
  // centros.setStyle(heatmap);
});
