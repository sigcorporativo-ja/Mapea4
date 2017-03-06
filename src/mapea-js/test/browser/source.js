window.mapajs = M.map({
  container: 'map',
  controls: ['layerswitcher', 'getfeatureinfo', 'panzoom', 'panzoombar'],
  layers: ['MAPBOX*mapbox.streets*mapbox.streets*true',
    'MAPBOX*mapbox.satellite*mapbox.satellite*true',
    'MAPBOX*mapbox.streets-satellite*mapbox.streets-satellite*true',
    'WMS*a1486630671501_manzanas_sevilla*http://g-gis-online-lab.desarrollo.guadaltel.es/geoserver/ws_pruebas/wms?*a1486630671501_manzanas_sevilla*true*false',
    'WMS*a1486630998986_capitales*http://g-gis-online-lab.desarrollo.guadaltel.es/geoserver/ws_pruebas/wms?*a1486630998986_capitales*true*false',
    'WMS*a1486630875752_colegios*http://g-gis-online-lab.desarrollo.guadaltel.es/geoserver/ws_pruebas/wms?*a1486630875752_colegios*true*false'],
  bbox: [-141.3986013986014, -74.05594405594407, 38.6013986013986, 57.6923076923077],
  projection: 'EPSG:4326*d'
});
