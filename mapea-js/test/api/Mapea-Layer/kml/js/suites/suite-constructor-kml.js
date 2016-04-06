(function (suiteModule) {
   suiteModule.constructorKML = function () {
      suite('Constructor con parámetro \'kml\'', function () {
         var layer;

         setup(function () {
            layer = new M.layer.KML({
               type: KML,
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });
         });

         test('Constructor a partir de una capa KML creada', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               kml: layer
            });

            suiteModule.asserts.oneKMLLayer(mapa);

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getKML());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos veces la misma capa KML', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               kml: layer
            });
            var numLayersInit = mapa.getLayers().length;
            var numWMCInit = mapa.getWMC().length;
            var numKMLInit = mapa.getKML().length;
            var numWMSInit = mapa.getWMS().length;
            var numWMSCInit = null;
            var numWFSInit = mapa.getWFS().length;
            var numWMTSInit = mapa.getWMTS().length;
            var numMBtilesInit = mapa.getMBtiles().length;

            mapa.addKML(layer);
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

         test('Añadimos dos capas KML iguales', function () {
            var newLayer = new M.layer.KML({
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });

            var mapa = M.map({
               container: 'constructor-tests',
               kml: [layer, newLayer]
            });

            suiteModule.asserts.oneKMLLayer(mapa);

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getKML());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Añadimos dos capas KML distintas de una vez', function () {
            var newLayer = new M.layer.KML({
               url: URL_KML_2,
               name: NAME_KML_2
            });

            var mapa = M.map({
               container: 'constructor-tests',
               kml: [layer, newLayer]
            });

            suiteModule.asserts.layerExistsOn(layer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(layer, mapa.getKML());
            suiteModule.asserts.layerExistsOn(newLayer, mapa.getLayers());
            suiteModule.asserts.layerExistsOn(newLayer, mapa.getKML());

            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(layer, mapa.getMBtiles(), 'MBtiles');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWMS(), 'WMS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWMC(), 'WMC');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWFS(), 'WFS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getWMTS(), 'WMTS');
            suiteModule.asserts.layerDoesNotExistOn(newLayer, mapa.getMBtiles(), 'MBtiles');
         });

         test('Falla porque intento añadir una capa que de tipo desconocido (1)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  kml: 'tipoInexistente'.concat('*').concat(NAME_KML)
                     .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                     .concat('*').concat(EXTRACT_ATTRIBUTES)
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo desconocido (2)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  kml: {
                     type: 'tipoInexistente',
                     url: URL_KML,
                     name: NAME_KML,
                     extract: EXTRACT_ATTRIBUTES
                  }
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es KML (1)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  kml: 'WMS'.concat('*').concat(NAME_KML)
                     .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                     .concat('*').concat(EXTRACT_ATTRIBUTES)
               });
            });
         });
         test('Falla porque intento añadir una capa que de tipo que no es KML (2)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  kml: {
                     type: M.layer.type.WMS,
                     url: URL_KML,
                     name: NAME_KML,
                     extract: EXTRACT_ATTRIBUTES
                  }
               });
            });
         });
         test('Falla porque intento añadir una capa sin URL ni nombre', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  kml: {
                     type: M.layer.type.KML
                  }
               });
            });
         });
      });
   };
})(window.mapeaSuite.kml || {});