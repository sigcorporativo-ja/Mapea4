(function (suiteModule) {
   // module
   suiteModule.asserts = {};

   suiteModule.asserts.layerIsWMC = function (layer, urlContext, nameContext) {
      assert.isNotNull(layer, 'la capa creada no es nula');
      assert.isObject(layer, 'la capa creada es un objeto');
      assert.isFunction(layer.select, 'la capa creada posee el método \'select\'');
      assert.isFalse(layer.selected, 'la capa creada no está seleccionada');
      assert.strictEqual(layer.type, M.layer.type.WMC, 'la capa creada es del tipo \'M.layer.type.WMC\'');

      if (!urlContext) {
         assert.isNotNull(layer.url, 'la capa creada tiene la URL del contexto predefinido');
         assert.isString(layer.url, 'la URL de la capa creada es tipo string');
         assert.isAbove(layer.url.length, 0, 'la URL de la capa creada tiene una longitud mayor que 0');
      }
      else {
         assert.strictEqual(layer.url, urlContext, 'la capa creada tiene la URL especificada');
      }

      if (!nameContext) {
         assert.isNotNull(layer.name, 'la capa creada tiene un nombre autogenerado');
         assert.isString(layer.name, 'el nombre de la capa creada es tipo string');
         assert.isAbove(layer.name.length, 0, 'el nombre de la capa creada tiene una longitud mayor que 0');
      }
      else {
         assert.strictEqual(layer.name, nameContext, 'la capa creada tiene el nombre especificado');
      }

      assert.instanceOf(layer, M.layer.WMC, 'la capa es una instancia de M.layer.WMC');
   };

   suiteModule.asserts.numLayers = function (map, numLayers, numWMC, numKML, numWMS,
      numWMSC, numWFS, numWMTS, numMBtiles, increase) {
      if (increase) {
         assert.isAbove(map.getLayers().length, numLayers, 'El número de capas ha aumentado');
         assert.isAbove(map.getWMC().length, numWMC, 'El número de capas WMC ha aumentado');
      }
      else {
         assert.strictEqual(map.getLayers().length, numLayers, 'El número de capas sigue igual');
         assert.strictEqual(map.getWMC().length, numWMC, 'El número de capas WMC sigue igual');
      }
      assert.strictEqual(map.getKML().length, numKML, 'El número de capas KML sigue igual');
      assert.strictEqual(map.getWMS().length, numWMS, 'El número de capas WMS sigue igual');
      assert.strictEqual(map.getWFS().length, numWFS, 'El número de capas WFS sigue igual');
      assert.strictEqual(map.getWMTS().length, numWMTS, 'El número de capas WMTS sigue igual');
      assert.strictEqual(map.getMBtiles().length, numMBtiles, 'El número de capas MBtiles sigue igual');
   };

   suiteModule.asserts.removedLayers = function (map, numLayers, numWMC, numKML, numWMS,
      numWMSC, numWFS, numWMTS, numMBtiles, increase) {
      assert.isBelow(map.getLayers().length, numLayers, 'El número de capas ha disminuido');
      assert.isBelow(map.getWMC().length, numWMC, 'El número de capas WMC ha disminuido');
      assert.strictEqual(map.getKML().length, numKML, 'El número de capas KML sigue igual');
      assert.strictEqual(map.getWMS().length, numWMS, 'El número de capas WMS sigue igual');
      assert.strictEqual(map.getWFS().length, numWFS, 'El número de capas WFS sigue igual');
      assert.strictEqual(map.getWMTS().length, numWMTS, 'El número de capas WMTS sigue igual');
      assert.strictEqual(map.getMBtiles().length, numMBtiles, 'El número de capas MBtiles sigue igual');
   };

   suiteModule.asserts.layerExistsOn = function (layer, layers) {
      var found = false;
      for (var i = 0, il = layers.length;
         (i < il) && !found; i++) {
         var l = layers[i];
         found = ((l.type === M.layer.type.WMC) && (l.name === layer.name) && (l.url === layer.url));
      }
      assert.isTrue(found, 'la capa añadida se encuentra entre las capas del mapa');
   };

   suiteModule.asserts.layerDoesNotExistOn = function (layer, layers, type) {
      var found = false;
      for (var i = 0, il = layers.length;
         (i < il) && !found; i++) {
         var l = layers[i];
         found = ((l.type === M.layer.type.WMC) && (l.name === layer.name) && (l.url === layer.url));
      }
      assert.isFalse(found, 'la capa añadida NO se encuentra entre las capas ' + type + ' del mapa');
   };

   suiteModule.asserts.oneWMCLayer = function (map) {
      assert.strictEqual(map.getLayers()[0].type, M.layer.type.WMC, 'Únicamente hay una capa WMC');
      assert.lengthOf(map.getLayers(), 1, 'Únicamente hay una capa WMC');
      assert.lengthOf(map.getWMC(), 1, 'Únicamente hay una capa WMC');
      assert.lengthOf(map.getKML(), 0, 'No existen capas que no sean WMC');
      assert.lengthOf(map.getWMS(), 0, 'No existen capas que no sean WMC');
      assert.lengthOf(map.getWFS(), 0, 'No existen capas que no sean WMC');
      assert.lengthOf(map.getWMTS(), 0, 'No existen capas que no sean WMC');
      assert.lengthOf(map.getMBtiles(), 0, 'No existen capas que no sean WMC');
   };
})(window.mapeaSuite.wmc || {});