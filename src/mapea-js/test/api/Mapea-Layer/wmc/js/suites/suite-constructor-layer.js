(function (suiteModule) {
   suiteModule.constructorLayer = function () {
      suite('Constructor con parámetro \'layers\'', function () {
         var layer;

         setup(function () {
            layer = new M.layer.WMC({
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
         });

         test('Constructor a partir de una capa WMC creada', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               layers: layer
            });

            suiteModule.asserts.oneWMCLayer(mapa);

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getWMC());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos veces la misma capa WMC', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               layers: layer
            });
            var numLayersInit = mapa.getLayers().length;
            var numWMCInit = mapa.getWMC().length;
            var numKMLInit = mapa.getKML().length;
            var numWMSInit = mapa.getWMS().length;
            var numWMSCInit = null;
            var numWFSInit = mapa.getWFS().length;
            var numWMTSInit = mapa.getWMTS().length;
            var numMBtilesInit = mapa.getMBtiles().length;

            mapa.addLayers(layer);
            var numLayersAdded = mapa.getLayers().length;
            var numWMCAdded = mapa.getWMC().length;
            var numKMLAdded = mapa.getKML().length;
            var numWMSAdded = mapa.getWMS().length;
            var numWMSCAdded = null;
            var numWFSAdded = mapa.getWFS().length;
            var numWMTSAdded = mapa.getWMTS().length;
            var numMBtilesAdded = mapa.getMBtiles().length;

            assert.strictEqual(numLayersInit, numLayersAdded, 'No ha variado el número de capas');
            assert.strictEqual(numWMCInit, numWMCAdded, 'No ha variado el número de capas');
            assert.strictEqual(numKMLInit, numKMLAdded, 'No ha variado el número de capas');
            assert.strictEqual(numWMSInit, numWMSAdded, 'No ha variado el número de capas');
            assert.strictEqual(numWMSCInit, numWMSCAdded, 'No ha variado el número de capas');
            assert.strictEqual(numWFSInit, numWFSAdded, 'No ha variado el número de capas');
            assert.strictEqual(numWMTSInit, numWMTSAdded, 'No ha variado el número de capas');
            assert.strictEqual(numMBtilesInit, numMBtilesAdded, 'No ha variado el número de capas');
         });

         test('Añadimos dos capas WMC iguales', function () {
            var newLayer = new M.layer.WMC({
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });

            var mapa = M.map({
               container: 'constructor-tests',
               layers: [layer, newLayer]
            });

            suiteModule.asserts.oneWMCLayer(mapa);

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getWMC());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMC distintas de una vez', function () {
            var newLayer = new M.layer.WMC({
               url: URL_CONTEXT_2,
               name: NAME_CONTEXT_2
            });

            var mapa = M.map({
               container: 'constructor-tests',
               layers: [layer, newLayer]
            });

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getWMC());
            suiteModule.asserts.layerExistsOn(newLayer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(newLayer, mapa.getWMC());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMC distintas y seleccionamos una de ellas', function () {
            var newLayer = new M.layer.WMC({
               url: URL_CONTEXT_2,
               name: NAME_CONTEXT_2
            });

            var mapa = M.map({
               container: 'constructor-tests',
               layers: [layer, newLayer]
            });

            var selectLayer = mapa.getWMC({
               name: newLayer.name
            })[0];
            assert.isFalse(selectLayer.selected, 'la capa no está seleccionada');
            selectLayer.select();
            assert.isTrue(selectLayer.selected, 'la capa sí está seleccionada');
         });

         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  layers: 'tipoInexistente*'.concat(URL_CONTEXT)
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  layers: {
                     type: 'tipoInexistente',
                     url: URL_CONTEXT
                  }
               });
            });
         });
         test('Falla porque intento añadir una capa con un nombre predefinidio inexistente (1)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  layers: 'nombreContextoInexistente'
               });
            });
         });
         test('Falla porque intento añadir una capa con un nombre predefinidio inexistente (2)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  layers: {
                     name: 'nombreContextoInexistente'
                  }
               });
            });
         });
         test('Falla porque intento añadir una capa sin URL ni nombre', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  layers: {
                     type: M.layer.type.WMC
                  }
               });
            });
         });
      });
   };
})(window.mapeaSuite.wmc || {});