(function (suiteModule) {
   suiteModule.removeLayers = function () {

      suite('Método removeLayers', function () {
         var layer, layer2, numLayers, numWMC, numKML,
            numWMS, numWMSC, numWFS, numWMTS, numMBtiles;

         setup(function () {
            layer = new M.layer.KML({
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });
            map.addLayers(layer);

            layer2 = new M.layer.KML({
               url: URL_KML_2,
               name: NAME_KML_2
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

         test('Eliminamos la capa a partir de \'KML*NAME*URL\'', function () {
            var criteria = KML.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES);
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });

         test('Eliminamos la capa a partir de \'kmL*NAME*URL\'', function () {
            var criteria = kmL.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES);
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de \'KML*NAME*DIR*FILENAME*EXTRACT\'', function () {
            var criteria = KML.concat('*').concat(NAME_KML)
               .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
               .concat('*').concat(EXTRACT_ATTRIBUTES);
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de \'kmL*NAME*DIR*FILENAME*EXTRACT\'', function () {
            var criteria = kmL.concat('*').concat(NAME_KML)
               .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
               .concat('*').concat(EXTRACT_ATTRIBUTES);
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });

         // Objeto
         test('Eliminamos la capa a partir de objeto (1.1): tipo \'KML\', url y name', function () {
            var criteria = {
               type: KML,
               url: URL_KML,
               name: NAME_KML
            };
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de objeto (1.2): tipo \'kmL\', url y name', function () {
            var criteria = {
               type: kmL,
               url: URL_KML,
               name: NAME_KML
            };
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de objeto (1.3): tipo M.layer.type.KML, url y name', function () {
            var criteria = {
               type: M.layer.type.KML,
               url: URL_KML,
               name: NAME_KML
            };
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de objeto (2.1): tipo \'KML\'', function () {
            map.removeLayers({
               type: KML
            });

            var kmlLayers = map.getKML();

            assert.lengthOf(kmlLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de objeto (2.2): tipo \'kmL\'', function () {
            map.removeLayers({
               type: kmL
            });

            var kmlLayers = map.getKML();

            assert.lengthOf(kmlLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de objeto (2.3): tipo M.layer.type.KML', function () {
            map.removeLayers({
               type: M.layer.type.KML
            });

            var kmlLayers = map.getKML();

            assert.lengthOf(kmlLayers, 0, 'se han eliminado todas las capas KML');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de objeto (4.1): tipo \'KML\' y URL', function () {
            var criteria = {
               type: KML,
               url: URL_KML
            };
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de objeto (4.2): tipo \'kmL\' y URL', function () {
            var criteria = {
               type: kmL,
               url: URL_KML
            };
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de objeto (4.3): tipo M.layer.type.KML y URL', function () {
            var criteria = {
               type: M.layer.type.KML,
               url: URL_KML
            };
            map.removeLayers(criteria);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(criteria);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos la capa a partir de capa creada', function () {
            var foundLayers = map.getKML(URL_KML);
            map.removeLayers(foundLayers);

            var kmlLayers = map.getKML();
            var removedLayers = map.getKML(URL_KML);

            assert.strictEqual(kmlLayers[0].name, layer2.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(kmlLayers[0].url, layer2.url);
            assert.strictEqual(kmlLayers[0].type, layer2.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(layer2, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer2, map.getKML());
         });
         test('Eliminamos ambas capas', function () {
            map.removeLayers([layer, layer2]);

            var kmlLayers = map.getKML();

            assert.lengthOf(kmlLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getKML());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer2, map.getKML());
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
               map.removeLayers('tipoInexistente'.concat('*').concat(NAME_KML)
                  .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               map.removeLayers({
                  type: 'tipoInexistente',
                  url: URL_KML,
                  name: NAME_KML,
                  extract: EXTRACT_ATTRIBUTES
               });
            });
         });
      });
   };
})(window.mapeaSuite.kml || {});