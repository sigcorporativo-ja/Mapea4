(function (suiteModule) {
   suiteModule.addKML = function () {
      suite('Método addKML', function () {
         var layer, numLayers, numWMC, numKML,
            numWMS, numWMSC, numWFS, numWMTS, numMBtiles;

         setup(function () {
            layer = new M.layer.KML({
               type: KML,
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });
            numLayers = map.getLayers().length;
            numWMC = map.getWMC().length;
            numKML = map.getKML().length;
            numWMS = map.getWMS().length;
            numWFS = map.getWFS().length;
            numWMTS = map.getWMTS().length;
            numMBtiles = map.getMBtiles().length;
         });

         test('Añadimos una capa KML', function () {
            map.addKML(layer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getKML());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos veces la misma capa KML', function () {
            map.addKML(layer);
            var numLayersAdded = map.getLayers().length;
            var numWMCAdded = map.getWMC().length;
            var numKMLAdded = map.getKML().length;
            var numWMSAdded = map.getWMS().length;
            var numWMSCAdded = null;
            var numWFSAdded = map.getWFS().length;
            var numWMTSAdded = map.getWMTS().length;
            var numMBtilesAdded = map.getMBtiles().length;
            map.addKML(layer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.numLayers(map, numLayersAdded, numWMCAdded, numKMLAdded, numWMSAdded,
               numWMSCAdded, numWFSAdded, numWMTSAdded, numMBtilesAdded, false);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getKML());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas KML iguales', function () {
            map.addKML(layer);
            var numLayersAdded = map.getLayers().length;
            var numWMCAdded = map.getWMC().length;
            var numKMLAdded = map.getKML().length;
            var numWMSAdded = map.getWMS().length;
            var numWMSCAdded = null;
            var numWFSAdded = map.getWFS().length;
            var numWMTSAdded = map.getWMTS().length;
            var numMBtilesAdded = map.getMBtiles().length;

            var newLayer = new M.layer.KML({
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });
            map.addKML(newLayer);

            suiteModule.asserts.numLayers(map, numLayers, numWMC, numKML, numWMS,
               numWMSC, numWFS, numWMTS, numMBtiles, true);
            suiteModule.asserts.numLayers(map, numLayersAdded, numWMCAdded, numKMLAdded, numWMSAdded,
               numWMSCAdded, numWFSAdded, numWMTSAdded, numMBtilesAdded, false);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getKML());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas WMS distintas de una vez', function () {
            var newLayer = new M.layer.KML({
               url: URL_KML_2,
               name: NAME_KML_2
            });
            map.addKML([layer, newLayer]);

            suiteModule.asserts.layerExistsOn(layer, map.getLayers());
            suiteModule.asserts.layerExistsOn(layer, map.getKML());
            suiteModule.asserts.layerExistsOn(newLayer, map.getLayers());
            suiteModule.asserts.layerExistsOn(newLayer, map.getKML());

            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, map.getMBtiles(), 'MBtiles');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, map.getMBtiles(), 'MBtiles');
         });

         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.addKML();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.addKML(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.addKML([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.addKML([null, null]);
            });
         });
         test('Falla porque especifico un parámetro objeto vacío', function () {
            assert.throw(function () {
               map.addKML({});
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               map.addKML('tipoInexistente'.concat('*').concat(NAME_KML)
                  .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               map.addKML({
                  type: 'tipoInexistente',
                  url: URL_KML,
                  name: NAME_KML,
                  extract: EXTRACT_ATTRIBUTES
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es KML (1)', function () {
            assert.throw(function () {
               map.addKML('WMS'.concat('*').concat(NAME_KML)
                  .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es KML (2)', function () {
            assert.throw(function () {
               map.addKML({
                  type: 'WMS',
                  url: URL_KML,
                  name: NAME_KML,
                  extract: EXTRACT_ATTRIBUTES
               });
            });
         });
         test('Falla porque intento añadir una capa sin URL ni nombre', function () {
            assert.throw(function () {
               map.addKML({
                  type: M.layer.type.KML
               });
            });
         });
      });
   };
})(window.mapeaSuite.kml || {});