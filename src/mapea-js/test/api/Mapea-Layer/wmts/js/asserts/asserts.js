(function (suiteModule) {
   // module
   suiteModule.asserts = {};

   suiteModule.asserts.layerIsWMTS = function (layer, url, name, matrixSet, title) {
      assert.isNotNull(layer, 'la capa creada no es nula');
      assert.isObject(layer, 'la capa creada es un objeto');
      assert.strictEqual(layer.type, M.layer.type.WMTS, 'la capa creada es del tipo \'M.layer.type.WMTS\'');

      // url
      assert.strictEqual(layer.url, url, 'la capa creada tiene la URL especificado');
      // name
      assert.strictEqual(layer.name, name, 'la capa creada tiene el nombre especificado');
      // matrixSet
      if (matrixSet != null) {
         assert.strictEqual(layer.matrixSet, matrixSet, 'la capa creada tiene el matrixSet especificado');
      }
      // title
      if (title != null) {
         assert.strictEqual(layer.legend, title, 'la capa creada tiene el título especificado');
      }
      else {
         assert.strictEqual(layer.legend, name, 'la capa creada tiene como título el nombre especificado');
      }
      // instance
      assert.instanceOf(layer, M.layer.WMTS, 'la capa es una instancia de M.layer.WMTS');
   };

   suiteModule.asserts.numLayers = function (map, numLayers, numWMC, numKML, numWMS,
      numWMSC, numWFS, numWMTS, numMBtiles, increase) {
      if (increase) {
         assert.isAbove(map.getLayers().length, numLayers, 'El número de capas ha aumentado');
         assert.isAbove(map.getWMS().length, numWMS, 'El número de capas WMS ha aumentado');
      }
      else {
         assert.strictEqual(map.getLayers().length, numLayers, 'El número de capas sigue igual');
         assert.strictEqual(map.getWMS().length, numWMS, 'El número de capas WMS sigue igual');
      }
      assert.strictEqual(map.getKML().length, numKML, 'El número de capas KML sigue igual');
      assert.strictEqual(map.getWMC().length, numWMC, 'El número de capas WMC sigue igual');
      assert.strictEqual(map.getWFS().length, numWFS, 'El número de capas WFS sigue igual');
      assert.strictEqual(map.getWMTS().length, numWMTS, 'El número de capas WMTS sigue igual');
      assert.strictEqual(map.getMBtiles().length, numMBtiles, 'El número de capas MBtiles sigue igual');
   };

   suiteModule.asserts.removedLayers = function (map, numLayers, numWMC, numKML, numWMS,
      numWMSC, numWFS, numWMTS, numMBtiles, increase) {
      assert.isBelow(map.getLayers().length, numLayers, 'El número de capas ha disminuido');
      assert.isBelow(map.getWMS().length, numWMS, 'El número de capas WMC ha disminuido');
      assert.strictEqual(map.getKML().length, numKML, 'El número de capas KML sigue igual');
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
         found = ((l.type === M.layer.type.WMS) && (l.name === layer.name) && (l.url === layer.url));
      }
      assert.isTrue(found, 'la capa añadida se encuentra entre las capas del mapa');
   };

   suiteModule.asserts.layerDoesNotExistOn = function (layer, layers, type) {
      var found = false;
      for (var i = 0, il = layers.length;
         (i < il) && !found; i++) {
         var l = layers[i];
         found = ((l.type === M.layer.type.WMS) && (l.name === layer.name) && (l.url === layer.url));
      }
      assert.isFalse(found, 'la capa añadida NO se encuentra entre las capas ' + type + ' del mapa');
   };

   suiteModule.asserts.oneWMSLayer = function (map) {
      assert.strictEqual(map.getLayers()[0].type, M.layer.type.WMS, 'Únicamente hay una capa WMS');
      assert.lengthOf(map.getLayers(), 1, 'Únicamente hay una capa WMS');
      assert.lengthOf(map.getWMS(), 1, 'Únicamente hay una capa WMS');
      assert.lengthOf(map.getKML(), 0, 'No existen capas que no sean WMS');
      assert.lengthOf(map.getWMC(), 0, 'No existen capas que no sean WMS');
      assert.lengthOf(map.getWFS(), 0, 'No existen capas que no sean WMS');
      assert.lengthOf(map.getWMTS(), 0, 'No existen capas que no sean WMS');
      assert.lengthOf(map.getMBtiles(), 0, 'No existen capas que no sean WMS');
   };
})(window.mapeaSuite.wmts || {});