(function (suiteModule) {
   suiteModule.constructorLayer = function () {
      suite('Constructor con parámetro \'layers\'', function () {
         var layer;

         setup(function () {
            layer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               transparent: TRANSPARENCE_WMS,
               tiled: TILED_WMS,
               cql: CQL_WMS,
               version: VERSION_WMS
            });
         });

         test('Constructor a partir de una capa WMS creada', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               layers: layer
            });

            suiteModule.asserts.oneWMSLayer(mapa);

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getWMS());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos veces la misma capa WMS', function () {
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

         test('Añadimos dos capas WMS iguales', function () {
            var newLayer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               transparent: TRANSPARENCE_WMS,
               tiled: TILED_WMS,
               cql: CQL_WMS,
               version: VERSION_WMS
            });

            var mapa = M.map({
               container: 'constructor-tests',
               layers: [layer, newLayer]
            });

            suiteModule.asserts.oneWMSLayer(mapa);

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getWMS());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMS distintas de una vez', function () {
            var newLayer = new M.layer.WMS({
               url: URL_WMS_2,
               name: NAME_WMS_2,
               legend: TITLE_WMS_2,
               transparent: TRANSPARENCE_WMS_2,
               tiled: TILED_WMS_2
            });

            var mapa = M.map({
               container: 'constructor-tests',
               layers: [layer, newLayer]
            });

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getWMS());
            suiteModule.asserts.layerExistsOn(newLayer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(newLayer, mapa.getWMS());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  layers: 'tipoInexistente'.concat('*').concat(TITLE_WMS)
                     .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
                     .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS)
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  layers: {
                     type: 'tipoInexistente',
                     url: URL_WMS,
                     name: NAME_WMS,
                     legend: TITLE_WMS,
                     transparent: TRANSPARENCE_WMS,
                     tiled: TILED_WMS,
                     cql: CQL_WMS,
                     version: VERSION_WMS
                  }
               });
            });
         });
         test('Falla porque intento añadir una capa sin URL ni nombre', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  layers: {
                     type: M.layer.type.WMS
                  }
               });
            });
         });
      });
   };
})(window.mapeaSuite.wms || {});