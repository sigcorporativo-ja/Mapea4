let mapa = M.map({
  container: 'map',
  controls: ['layerswitcher'],
  layers: ["OSM"],
  bbox: [96388, 3959795, 621889, 4299792],
  zoom: 3
});


let provincias = new M.layer.GeoJSON({
  name: "Provincias",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json",
  extract: true
});



let campamentos = new M.layer.GeoJSON({
  name: "Campamentos",
  url: "https://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&",
  extract: true
});


let capaWMS = new M.layer.WMS({
  url: 'https://www.ideandalucia.es/services/andalucia/wms?',
  name: '05_Red_Viaria',
  legend: 'Red Viaria',
  transparent: true,
  tiled: false
});


const layerGroup1 = new M.layer.LayerGroup({
  id: 'id_grupo_1',
  title: 'Grupo 1',
  collapsed: true,
  zIndex: 100000,
  children: [provincias, campamentos, capaWMS],
  order: 0
});

mapa.addLayerGroup(layerGroup1);

console.log('La agrupación ' + layerGroup1.title + ' tiene ' + layerGroup1.getChildren().length + ' capas hijas');
