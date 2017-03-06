(function (suiteModule) {
   suiteModule.addWMS = function () {
      suite('Método addWMS', function () {
         var layer, numLayers, numWMC, numKML,
            numWMS, numWMSC, numWFS, numWMTS, numMBtiles;

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
            numLayers = map.getLayers().length;
            numWMC = map.getWMC().length;
            numKML = map.getKML().length;
            numWMS = map.getWMS().length;
            numWFS = map.getWFS().length;
            numWMTS = map.getWMTS().length;
            numMBtiles = map.getMBtiles().length;
         });

         test('Añadimos una capa WMS', function () {
            map.addWMS(layer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getWMS());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos veces la misma capa WMS', function () {
            map.addWMS(layer);
            var numLayersAdded = map.getLayers().length;
            var numWMCAdded = map.getWMC().length;
            var numKMLAdded = map.getKML().length;
            var numWMSAdded = map.getWMS().length;
            var numWMSCAdded = null;
            var numWFSAdded = map.getWFS().length;
            var numWMTSAdded = map.getWMTS().length;
            var numMBtilesAdded = map.getMBtiles().length;
            map.addWMS(layer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.numLayers(map, numLayersAdded, numWMCAdded, numKMLAdded, numWMSAdded,
               numWMSCAdded, numWFSAdded, numWMTSAdded, numMBtilesAdded, false);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getWMS());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMS iguales', function () {
            map.addWMS(layer);
            var numLayersAdded = map.getLayers().length;
            var numWMCAdded = map.getWMC().length;
            var numKMLAdded = map.getKML().length;
            var numWMSAdded = map.getWMS().length;
            var numWMSCAdded = null;
            var numWFSAdded = map.getWFS().length;
            var numWMTSAdded = map.getWMTS().length;
            var numMBtilesAdded = map.getMBtiles().length;

            var newLayer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               cql: CQL_WMS,
               version: VERSION_WMS
            });
            map.addWMS(newLayer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.numLayers(map, numLayersAdded, numWMCAdded, numKMLAdded, numWMSAdded,
               numWMSCAdded, numWFSAdded, numWMTSAdded, numMBtilesAdded, false);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getWMS());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMS distintas de una vez', function () {
            var newLayer = new M.layer.WMS({
               url: URL_WMS_2,
               name: NAME_WMS_2,
               legend: TITLE_WMS_2,
               transparent: TRANSPARENCE_WMS_2,
               tiled: TILED_WMS_2
            });
            map.addWMS([layer, newLayer]);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(newLayer, map.getLayers());
            suiteModule.asserts.layerExistsOn(newLayer, map.getWMS());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getKML(), 'KML');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWMC(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getMBtiles(), 'MBtiles');
         });

         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.addWMS();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.addWMS(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.addWMS([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.addWMS([null, null]);
            });
         });
         test('Falla porque especifico un parámetro objeto vacío', function () {
            assert.throw(function () {
               map.addWMS({});
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               map.addWMS('tipoInexistente'.concat('*').concat(NAME_WMS)
                  .concat('*').concat(URL_WMS).concat('*').concat(TITLE_WMS)
                  .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               map.addWMS({
                  type: 'tipoInexistente',
                  url: URL_WMS,
                  name: NAME_WMS,
                  legend: TITLE_WMS,
                  transparent: TRANSPARENCE_WMS,
                  tiled: TILED_WMS,
                  cql: CQL_WMS,
                  version: VERSION_WMS
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es WMC (1)', function () {
            assert.throw(function () {
               map.addWMS('KML'.concat('*').concat(NAME_WMS)
                  .concat('*').concat(URL_WMS).concat('*').concat(TITLE_WMS)
                  .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es WMC (2)', function () {
            assert.throw(function () {
               map.addWMS({
                  type: M.layer.type.KML,
                  url: URL_WMS,
                  name: NAME_WMS,
                  legend: TITLE_WMS,
                  transparent: TRANSPARENCE_WMS,
                  tiled: TILED_WMS,
                  cql: CQL_WMS,
                  version: VERSION_WMS
               });
            });
         });
         test('Falla porque intento añadir una capa sin URL ni nombre', function () {
            assert.throw(function () {
               map.addWMS({
                  type: M.layer.type.WMS
               });
            });
         });
      });
   };
})(window.mapeaSuite.wms || {});