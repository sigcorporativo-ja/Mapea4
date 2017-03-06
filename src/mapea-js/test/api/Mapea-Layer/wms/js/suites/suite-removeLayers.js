(function (suiteModule) {
   suiteModule.removeLayers = function () {

      suite('Método removeLayers', function () {
         var layer, layer2, numLayers, numWMC, numKML,
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
            map.addLayers(layer);

            layer2 = new M.layer.WMS({
               url: URL_WMS_2,
               name: NAME_WMS_2,
               legend: TITLE_WMS_2,
               transparent: TRANSPARENCE_WMS_2,
               tiled: TILED_WMS_2
            });
            map.addLayers(layer2);

            numLayers = map.getLayers().length;
            numWMC = map.getWMC().length;
            numKML = map.getKML().length;
            numWMS = map.getWMS().length;
            numWFS = map.getWFS().length;
            numWMTS = map.getWMTS().length;
            numMBtiles = map.getMBtiles().length;
         });
         test('Eliminamos la capa a partir de \'WMS*TITLE*URL\'', function () {
            var criteria = WMS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS);
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });

         test('Eliminamos la capa a partir de \'wmS*TITLE*URL\'', function () {
            var criteria = wmS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS);
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de \'WMS*NAME*URL*TITLE*TRANSPARENCE*TILED\'', function () {
            var criteria = WMS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS);
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de \'wmS*NAME*URL*TITLE*TRANSPARENCE*TILED\'', function () {
            var criteria = wmS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS);
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });

         // Objeto
         test('Eliminamos la capa a partir de objeto (1.1): tipo \'WMS\', url y name', function () {
            var criteria = {
               type: WMS,
               url: URL_WMS,
               name: NAME_WMS
            };
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de objeto (1.2): tipo \'wmS\', url y name', function () {
            var criteria = {
               type: wmS,
               url: URL_WMS,
               name: NAME_WMS
            };
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de objeto (1.3): tipo M.layer.type.WMS, url y name', function () {
            var criteria = {
               type: M.layer.type.WMS,
               url: URL_WMS,
               name: NAME_WMS
            };
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de objeto (2.1): tipo \'WMS\'', function () {
            map.removeLayers({
               type: WMS
            });

            var wmsLayers = map.getWMS();

            assert.lengthOf(wmsLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de objeto (2.2): tipo \'wmS\'', function () {
            map.removeLayers({
               type: wmS
            });

            var wmsLayers = map.getWMS();

            assert.lengthOf(wmsLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de objeto (2.3): tipo M.layer.type.WMC', function () {
            map.removeLayers({
               type: M.layer.type.WMS
            });

            var wmsLayers = map.getWMS();

            assert.lengthOf(wmsLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de objeto (4.1): tipo \'WMS\' y URL', function () {
            var criteria = {
               type: WMS,
               url: URL_WMS
            };
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de objeto (4.2): tipo \'wmS\' y URL', function () {
            var criteria = {
               type: wmS,
               url: URL_WMS
            };
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de objeto (4.3): tipo M.layer.type.WMS y URL', function () {
            var criteria = {
               type: M.layer.type.WMS,
               url: URL_WMS
            };
            map.removeLayers(criteria);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(criteria);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos la capa a partir de capa creada', function () {
            var foundLayers = map.getWMS(URL_WMS);
            map.removeLayers(foundLayers);

            var wmsLayers = map.getWMS();
            var removedLayers = map.getWMS(URL_WMS);

            assert.strictEqual(wmsLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmsLayers[0].url, layer2.url);
            assert.strictEqual(wmsLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getWMS());
         });
         test('Eliminamos ambas capas', function () {
            map.removeLayers([layer, layer2]);

            var wmsLayers = map.getWMS();

            assert.lengthOf(wmsLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getWMS());
         });

         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.removeLayers();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.removeLayers(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.removeLayers([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.removeLayers([null, null]);
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               map.removeLayers('tipoInexistente'.concat('*').concat(TITLE_WMS)
                  .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
                  .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               map.removeLayers({
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
      });
   };
})(window.mapeaSuite.wms || {});