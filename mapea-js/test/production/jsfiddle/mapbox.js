var mapajs = M.map({
  container: "map",
  layers: [new M.layer.Mapbox({
    type: "Mapbox",
    url: "https://api.mapbox.com/v4/",
    name: "mapbox.satellite",
    legend: "Calles"
  })],
  bbox: [96388, 3959795, 621889, 4299792],
  controls: ["layerswitcher", "mouse"],
  zoom: 3
});
