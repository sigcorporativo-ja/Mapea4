(function (suiteModule) {
   suiteModule.removeWMC = function () {

      suite('Método removeWMC', function () {
         var layer, layerPredefined, numLayers, numWMC, numKML,
            numWMS, numWMSC, numWFS, numWMTS, numMBtiles;

         setup(function () {
            layer = new M.layer.WMC({
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            map.addLayers(layer);

            layerPredefined = new M.layer.WMC(PREDEFINED_CONTEXT);
            map.addLayers(layerPredefined);

            numLayers = map.getLayers().length;
            numWMC = map.getWMC().length;
            numKML = map.getKML().length;
            numWMS = map.getWMS().length;
            numWMSC = null;
            numWFS = map.getWFS().length;
            numWMTS = map.getWMTS().length;
            numMBtiles = map.getMBtiles().length;
         });

         // formato v3
         test('Eliminamos la capa añadida por URL', function () {
            map.removeWMC(URL_CONTEXT);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(URL_CONTEXT);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa añadida por nombre', function () {
            map.removeWMC(NAME_CONTEXT);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(NAME_CONTEXT);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });

         // formato v4
         test('Eliminamos la capa a partir de \'WMC*URL_CONTEXT\'', function () {
            var criteria = WMC.concat('*').concat(URL_CONTEXT);
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });

         test('Eliminamos la capa a partir de \'wmC*URL_CONTEXT\'', function () {
            var criteria = wmC.concat('*').concat(URL_CONTEXT);
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de \'WMC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var criteria = WMC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT);
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de \'wmC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var criteria = wmC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT);
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });

         // Objeto
         test('Eliminamos la capa a partir de objeto (1.1): tipo \'WMC\', url y name', function () {
            var criteria = {
               type: WMC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            };
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (1.2): tipo \'wmC\', url y name', function () {
            var criteria = {
               type: wmC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            };
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (1.3): tipo M.layer.type.WMC, url y name', function () {
            var criteria = {
               type: M.layer.type.WMC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            };
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (2.1): tipo \'WMC\'', function () {
            map.removeWMC({
               type: WMC
            });

            var wmcLayers = map.getWMC();

            assert.lengthOf(wmcLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerDoesNotExistOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (2.2): tipo \'wmC\'', function () {
            map.removeWMC({
               type: wmC
            });

            var wmcLayers = map.getWMC();

            assert.lengthOf(wmcLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerDoesNotExistOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (2.3): tipo M.layer.type.WMC', function () {
            map.removeWMC({
               type: M.layer.type.WMC
            });

            var wmcLayers = map.getWMC();

            assert.lengthOf(wmcLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerDoesNotExistOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (4.1): tipo \'WMC\' y URL', function () {
            var criteria = {
               type: WMC,
               url: URL_CONTEXT
            };
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (4.2): tipo \'wmC\' y URL', function () {
            var criteria = {
               type: wmC,
               url: URL_CONTEXT
            };
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (4.3): tipo M.layer.type.WMC y URL', function () {
            var criteria = {
               type: M.layer.type.WMC,
               url: URL_CONTEXT
            };
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (5.1): nombre', function () {
            var criteria = {
               name: NAME_CONTEXT
            };
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de objeto (5.2): URL', function () {
            var criteria = {
               url: URL_CONTEXT
            };
            map.removeWMC(criteria);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(criteria);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos la capa a partir de capa creada', function () {
            var foundLayers = map.getWMC(URL_CONTEXT);
            map.removeWMC(foundLayers);

            var wmcLayers = map.getWMC();
            var removedLayers = map.getWMC(URL_CONTEXT);

            assert.strictEqual(wmcLayers[0].name, layerPredefined.name, 'la capa que queda es la que no se ha eliminado');
            assert.strictEqual(wmcLayers[0].url, layerPredefined.url);
            assert.strictEqual(wmcLayers[0].type, layerPredefined.type);
            assert.lengthOf(removedLayers, 0, 'la capa eliminada no se encuentra en el mapa');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerExistsOn(layerPredefined, map.getWMC());
         });
         test('Eliminamos ambas capas', function () {
            map.removeWMC([layer, layerPredefined]);

            var wmcLayers = map.getWMC();

            assert.lengthOf(wmcLayers, 0, 'se han eliminado todas las capas WMC');
            suiteModule.asserts.removedLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC());
            suiteModule.asserts.layerDoesNotExistOn(layerPredefined, map.getLayers());
            suiteModule.asserts.layerDoesNotExistOn(layerPredefined, map.getWMC());
         });

         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.removeWMC();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.removeWMC(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.removeWMC([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.removeWMC([null, null]);
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               map.removeWMC('tipoInexistente*'.concat(URL_CONTEXT));
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               map.removeWMC({
                  type: 'tipoInexistente',
                  url: URL_CONTEXT
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es WMC (1)', function () {
            assert.throw(function () {
               map.removeWMC('KML*'.concat(URL_CONTEXT));
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es WMC (2)', function () {
            assert.throw(function () {
               map.removeWMC({
                  type: M.layer.type.KML,
                  url: URL_CONTEXT
               });
            });
         });
      });
   };
})(window.mapeaSuite.wmc || {});