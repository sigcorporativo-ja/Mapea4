var mapajs = M.map({
  'container': 'map',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline"]
});

var centros = new M.layer.GeoJSON({
  name: "centrosassda",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/mapea/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mapea:assda_sv10_ayuntamiento_point_indicadores&outputFormat=application/json&srsname=EPSG:4326",
  legend: "Centros ASSDA",
  extract: true
});

centros.setStyle(new M.style.Cluster());

mapajs.addLayers(centros);
