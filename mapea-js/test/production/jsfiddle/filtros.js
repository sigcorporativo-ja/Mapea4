 let mapajs = M.map({
   container: "map",
   wmcfile: "mapa",
   controls: ["layerswitcher"]
 });

 //GeoJSON servido
 let lyProvincias = new M.layer.WFS({
   name: "Provincias",
   url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wfs",
   namespace: "tematicos"
 });
 let lyEnvelope = new M.layer.GeoJSON({
   source: {
     "crs": {
       "properties": {
         "name": "EPSG:25830"
       },
       "type": "name"
     },
     "features": [],
     "type": "FeatureCollection"
   },
   name: 'envelope'
 });

 lyProvincias.on(M.evt.SELECT_FEATURES, function(features) {

   parser = new jsts.io.GeoJSONReader();
   f = parser.read(features[0].getGeoJSON());
   objEnv = f.geometry.getEnvelopeInternal();

   fEnv = new M.Feature(features[0].getAttribute("nombre"), {
     "type": "Feature",
     "id": "fEnv",
     "geometry": {
       "type": "Polygon",
       "coordinates": [
         [
           [objEnv._minx, objEnv._miny],
           [objEnv._minx, objEnv._maxy],
           [objEnv._maxx, objEnv._maxy],
           [objEnv._maxx, objEnv._miny]
         ]
       ]
     },
     "geometry_name": "the_geom",
     "properties": {
       "nombre": "envelope"
     }
   });

   lyEnvelope.clear();
   lyEnvelope.addFeatures(fEnv);
 });

 mapajs.addLayers([lyProvincias, lyEnvelope]);
