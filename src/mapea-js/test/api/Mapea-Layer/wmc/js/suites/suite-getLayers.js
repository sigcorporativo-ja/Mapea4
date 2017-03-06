(function (suiteModule) {
   suiteModule.getLayers = function () {
      suite('Método getLayers', function () {
         var layer, layerPredefined;

         setup(function () {
            layer = new M.layer.WMC({
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            map.addLayers(layer);

            layerPredefined = new M.layer.WMC(PREDEFINED_CONTEXT);
            map.addLayers(layerPredefined);
         });

         test('Obtenemos la capa a partir de \'WMC*URL_CONTEXT\'', function () {
            var foundLayer = map.getLayers(WMC.concat('*').concat(URL_CONTEXT));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'wmC*URL_CONTEXT\'', function () {
            var foundLayer = map.getLayers(wmC.concat('*').concat(URL_CONTEXT));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'WMC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var foundLayer = map.getLayers(WMC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'wmC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var foundLayer = map.getLayers(wmC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });

         // Objeto
         test('Obtenemos la capa a partir de objeto (1.1): tipo \'WMC\', url y name', function () {
            var foundLayer = map.getLayers({
               type: WMC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (1.2): tipo \'wmC\', url y name', function () {
            var foundLayer = map.getLayers({
               type: wmC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (1.3): tipo M.layer.type.WMC, url y name', function () {
            var foundLayer = map.getLayers({
               type: M.layer.type.WMC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (2.1): tipo \'WMC\'', function () {
            var foundLayer = map.getLayers({
               type: WMC
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layerPredefined.name);
            assert.strictEqual(foundLayer[1].url, layerPredefined.url);
            assert.strictEqual(foundLayer[1].type, layerPredefined.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo WMC');
         });
         test('Obtenemos la capa a partir de objeto (2.2): tipo \'wmC\'', function () {
            var foundLayer = map.getLayers({
               type: wmC
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layerPredefined.name);
            assert.strictEqual(foundLayer[1].url, layerPredefined.url);
            assert.strictEqual(foundLayer[1].type, layerPredefined.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo WMC');
         });
         test('Obtenemos la capa a partir de objeto (2.3): tipo M.layer.type.WMC', function () {
            var foundLayer = map.getLayers({
               type: M.layer.type.WMC
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layerPredefined.name);
            assert.strictEqual(foundLayer[1].url, layerPredefined.url);
            assert.strictEqual(foundLayer[1].type, layerPredefined.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo WMC');
         });
         test('Obtenemos la capa a partir de objeto (4.1): tipo \'WMC\' y URL', function () {
            var foundLayer = map.getLayers({
               type: WMC,
               url: URL_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (4.2): tipo \'wmC\' y URL', function () {
            var foundLayer = map.getLayers({
               type: wmC,
               url: URL_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (4.3): tipo M.layer.type.WMC y URL', function () {
            var foundLayer = map.getLayers({
               type: M.layer.type.WMC,
               url: URL_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
      });
   };
})(window.mapeaSuite.wmc || {});