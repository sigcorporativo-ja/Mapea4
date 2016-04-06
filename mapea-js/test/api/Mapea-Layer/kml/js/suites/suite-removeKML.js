(function (suiteModule) {
   suiteModule.removeKML = function () {

      suite('Método removeKML', function () {
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

         // formato v3
         test('Eliminamos la capa añadida por URL', function () {
            map.removeKML(URL_KML);

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
         test('Eliminamos la capa añadida por nombre', function () {
            map.removeKML(NAME_KML);

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

         // formato v4
         test('Eliminamos la capa a partir de \'KML*NAME*URL\'', function () {
            var criteria = KML.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES);
            map.removeKML(criteria);

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
            map.removeKML(criteria);

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
            map.removeKML(criteria);

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
            map.removeKML(criteria);

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
            map.removeKML(criteria);

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
            map.removeKML(criteria);

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
            map.removeKML(criteria);

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
            map.removeKML({
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
            map.removeKML({
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
            map.removeKML({
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
            map.removeKML(criteria);

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
            map.removeKML(criteria);

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
            map.removeKML(criteria);

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
         test('Eliminamos la capa a partir de objeto (5.1): nombre', function () {
            var criteria = {
               name: NAME_KML
            };
            map.removeKML(criteria);

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
         test('Eliminamos la capa a partir de objeto (5.2): URL', function () {
            var criteria = {
               url: URL_KML
            };
            map.removeKML(criteria);

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
            map.removeKML(foundLayers);

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
            map.removeKML([layer, layer2]);

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
               map.removeKML();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.removeKML(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.removeKML([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.removeKML([null, null]);
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               map.removeKML('tipoInexistente'.concat('*').concat(NAME_KML)
                  .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               map.removeKML({
                  type: 'tipoInexistente',
                  url: URL_KML,
                  name: NAME_KML,
                  extract: EXTRACT_ATTRIBUTES
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es WMC (1)', function () {
            assert.throw(function () {
               map.removeKML('WMS'.concat('*').concat(NAME_KML)
                  .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es WMC (2)', function () {
            assert.throw(function () {
               map.removeKML({
                  type: M.layer.type.WMS,
                  url: URL_KML,
                  name: NAME_KML,
                  extract: EXTRACT_ATTRIBUTES
               });
            });
         });
      });
   };
})(window.mapeaSuite.kml || {});