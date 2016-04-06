(function (suiteModule) {
   suiteModule.addLayers = function () {
      suite('Método addLayers', function () {
         var layer, numLayers, numWMC, numKML,
            numWMS, numWMSC, numWFS, numWMTS, numMBtiles;

         setup(function () {
            layer = new M.layer.WMC({
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            numLayers = map.getLayers().length;
            numWMC = map.getWMC().length;
            numKML = map.getKML().length;
            numWMS = map.getWMS().length;
            numWFS = map.getWFS().length;
            numWMTS = map.getWMTS().length;
            numMBtiles = map.getMBtiles().length;
         });

         test('Añadimos una capa WMC', function () {
            map.addLayers(layer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getWMC());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos veces la misma capa WMC', function () {
            map.addLayers(layer);
            var numLayersAdded = map.getLayers().length;
            var numWMCAdded = map.getWMC().length;
            var numKMLAdded = map.getKML().length;
            var numWMSAdded = map.getWMS().length;
            var numWMSCAdded = null;
            var numWFSAdded = map.getWFS().length;
            var numWMTSAdded = map.getWMTS().length;
            var numMBtilesAdded = map.getMBtiles().length;
            map.addLayers(layer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.numLayers(map, numLayersAdded, numWMCAdded, numKMLAdded, numWMSAdded,
               numWMSCAdded, numWFSAdded, numWMTSAdded, numMBtilesAdded, false);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getWMC());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMC iguales', function () {
            map.addLayers(layer);
            var numLayersAdded = map.getLayers().length;
            var numWMCAdded = map.getWMC().length;
            var numKMLAdded = map.getKML().length;
            var numWMSAdded = map.getWMS().length;
            var numWMSCAdded = null;
            var numWFSAdded = map.getWFS().length;
            var numWMTSAdded = map.getWMTS().length;
            var numMBtilesAdded = map.getMBtiles().length;

            var newLayer = new M.layer.WMC({
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            map.addLayers(newLayer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.numLayers(map, numLayersAdded, numWMCAdded, numKMLAdded, numWMSAdded,
               numWMSCAdded, numWFSAdded, numWMTSAdded, numMBtilesAdded, false);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getWMC());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMC distintas de una vez', function () {
            var newLayer = new M.layer.WMC({
               url: URL_CONTEXT_2,
               name: NAME_CONTEXT_2
            });
            map.addLayers([layer, newLayer]);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(newLayer, map.getLayers());
            suiteModule.asserts.layerExistsOn(newLayer, map.getWMC());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMC distintas y seleccionamos una de ellas', function () {
            map.addLayers(layer);
            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            var numLayersAdded = map.getLayers().length;
            var numWMCAdded = map.getWMC().length;
            var numKMLAdded = map.getKML().length;
            var numWMSAdded = map.getWMS().length;
            var numWMSCAdded = null;
            var numWFSAdded = map.getWFS().length;
            var numWMTSAdded = map.getWMTS().length;
            var numMBtilesAdded = map.getMBtiles().length;

            var newLayer = new M.layer.WMC({
               url: URL_CONTEXT_2,
               name: NAME_CONTEXT_2
            });
            map.addLayers(newLayer);

            suiteModule.asserts.numLayers(map, numLayersAdded, numWMCAdded, numKMLAdded, numWMSAdded,
               numWMSCAdded, numWFSAdded, numWMTSAdded, numMBtilesAdded, true);

            var selectLayer = map.getWMC({
               name: newLayer.name
            })[0];
            assert.isFalse(selectLayer.selected, 'la capa no está seleccionada');
            selectLayer.select();
            assert.isTrue(selectLayer.selected, 'la capa sí está seleccionada');
         });

         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.addLayers();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.addLayers(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.addLayers([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.addLayers([null, null]);
            });
         });
         test('Falla porque especifico un parámetro objeto vacío', function () {
            assert.throw(function () {
               map.addLayers({});
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               map.addLayers('tipoInexistente*'.concat(URL_CONTEXT));
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               map.addLayers({
                  type: 'tipoInexistente',
                  url: URL_CONTEXT
               });
            });
         });
         test('Falla porque intento añadir una capa sin especificar tipo (1)', function () {
            assert.throw(function () {
               map.addLayers(URL_CONTEXT);
            });
         });
         test('Falla porque intento añadir una capa sin especificar tipo (2)', function () {
            assert.throw(function () {
               map.addLayers({
                  url: URL_CONTEXT
               });
            });
         });
         test('Falla porque intento añadir una capa sin especificar tipo (3)', function () {
            assert.throw(function () {
               map.addLayers({
                  name: 'nombreContextoInexistente'
               });
            });
         });
         test('Falla porque intento añadir una capa sin URL ni nombre', function () {
            assert.throw(function () {
               map.addLayers({
                  type: M.layer.type.WMC
               });
            });
         });
      });
   };
})(window.mapeaSuite.wmc || {});