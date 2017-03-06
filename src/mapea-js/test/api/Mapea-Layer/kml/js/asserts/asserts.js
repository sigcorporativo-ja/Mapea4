(function (suiteModule) {
   // module
   suiteModule.asserts = {};

   suiteModule.asserts.layerIsKML = function (layer, name, dir, filename, extract) {
      var layerUrl = dir;
      if (filename != null) {
         layerUrl = layerUrl.concat(filename);
      }
      assert.isNotNull(layer, 'la capa creada no es nula');
      assert.isObject(layer, 'la capa creada es un objeto');
      assert.instanceOf(layer, M.layer.KML, 'la capa creada es un KML');
      assert.strictEqual(layer.type, M.layer.type.KML, 'la capa creada es del tipo \'M.layer.type.KML\'');

      // name
      if (name != null) {
         assert.strictEqual(layer.name, name, 'la capa creada tiene el nombre especificado');
      }
      // url
      assert.strictEqual(layer.url, layerUrl, 'la capa creada tiene la URL especificada');

      // extract
      if (extract != null) {
         assert.strictEqual(layer.extract, extract, 'la capa creada el atributo extract como el especificado');
      }
      else {
         assert.isTrue(layer.extract, 'por defecto la capa tiene el atributo extract activado');
      }
   };

   suiteModule.asserts.numLayers = function (map, numLayers, numWMC, numKML, numWMS,
      numWMSC, numWFS, numWMTS, numMBtiles, increase) {
      if (increase) {
         assert.isAbove(map.getLayers().length, numLayers, 'El número de capas ha aumentado');
         assert.isAbove(map.getKML().length, numKML, 'El número de capas KML ha aumentado');
      }
      else {
         assert.strictEqual(map.getLayers().length, numLayers, 'El número de capas sigue igual');
         assert.strictEqual(map.getKML().length, numKML, 'El número de capas KML sigue igual');
      }
      assert.strictEqual(map.getWMS().length, numWMS, 'El número de capas WMS sigue igual');
      assert.strictEqual(map.getWMC().length, numWMC, 'El número de capas WMC sigue igual');
      assert.strictEqual(map.getWFS().length, numWFS, 'El número de capas WFS sigue igual');
      assert.strictEqual(map.getWMTS().length, numWMTS, 'El número de capas WMTS sigue igual');
      assert.strictEqual(map.getMBtiles().length, numMBtiles, 'El número de capas MBtiles sigue igual');
   };

   suiteModule.asserts.removedLayers = function (map, numLayers, numWMC, numKML, numWMS,
      numWMSC, numWFS, numWMTS, numMBtiles, increase) {
      assert.isBelow(map.getLayers().length, numLayers, 'El número de capas ha disminuido');
      assert.isBelow(map.getKML().length, numKML, 'El número de capas KML ha disminuido');
      assert.strictEqual(map.getWMS().length, numWMS, 'El número de capas KML sigue igual');
      assert.strictEqual(map.getWMC().length, numWMC, 'El número de capas WMS sigue igual');
      assert.strictEqual(map.getWFS().length, numWFS, 'El número de capas WFS sigue igual');
      assert.strictEqual(map.getWMTS().length, numWMTS, 'El número de capas WMTS sigue igual');
      assert.strictEqual(map.getMBtiles().length, numMBtiles, 'El número de capas MBtiles sigue igual');
   };

   suiteModule.asserts.layerExistsOn = function (layer, layers) {
      var found = false;
      for (var i = 0, il = layers.length;
         (i < il) && !found; i++) {
         var l = layers[i];
         found = ((l.type === M.layer.type.KML) && (l.name === layer.name) && (l.url === layer.url));
      }
      assert.isTrue(found, 'la capa añadida se encuentra entre las capas del mapa');
   };

   suiteModule.asserts.layerDoesNotExistOn = function (layer, layers, type) {
      var found = false;
      for (var i = 0, il = layers.length;
         (i < il) && !found; i++) {
         var l = layers[i];
         found = ((l.type === M.layer.type.KML) && (l.name === layer.name) && (l.url === layer.url));
      }
      assert.isFalse(found, 'la capa añadida NO se encuentra entre las capas ' + type + ' del mapa');
   };

   suiteModule.asserts.oneKMLLayer = function (map) {
      assert.strictEqual(map.getLayers()[0].type, M.layer.type.KML, 'Únicamente hay una capa KML');
      assert.lengthOf(map.getLayers(), 1, 'Únicamente hay una capa KML');
      assert.lengthOf(map.getKML(), 1, 'Únicamente hay una capa KML');
      assert.lengthOf(map.getWMS(), 0, 'No existen capas que no sean KML');
      assert.lengthOf(map.getWMC(), 0, 'No existen capas que no sean KML');
      assert.lengthOf(map.getWFS(), 0, 'No existen capas que no sean KML');
      assert.lengthOf(map.getWMTS(), 0, 'No existen capas que no sean KML');
      assert.lengthOf(map.getMBtiles(), 0, 'No existen capas que no sean KML');
   };
})(window.mapeaSuite.kml || {});