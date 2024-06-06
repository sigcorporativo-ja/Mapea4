  // OPCION 1: En el constructor del mapa, en modo cadena u objeto
  mapajs = M.map({
    container: "map",
    layers: ["WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA"],
    center: [363063, 4150610],
    zoom: '4',
    controls: ['layerswitcher']
  });

  // OPCION 2: Con el metodo addLayers
  /*var layer = new M.layer.WMTS({
    url: 'http://www.ign.es/wmts/pnoa-ma?',
    name: 'OI.OrthoimageCoverage',
    legend: 'Imagen (PNOA)',
    matrixSet: 'GoogleMapsCompatible',
  });

  mapajs.addWMTS(layer);*/
