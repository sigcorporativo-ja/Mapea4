let mapajs = M.map({
  container: "map",
  layers: [new M.layer.OSM()],
  center: [-543431, 4503560],
  controls: ["layerswitcher", "mouse"],
  zoom: 6,
  projection: "EPSG:3857*m"
});
