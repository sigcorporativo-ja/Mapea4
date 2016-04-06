(function (suiteModule) {
   suiteModule.getWMC = function () {
      suite('Método getWMC', function () {
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

         // formato v3
         test('Obtenemos la capa añadida por URL', function () {
            var foundLayer = map.getWMC(URL_CONTEXT);
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa añadida por nombre', function () {
            var foundLayer = map.getWMC(NAME_CONTEXT);
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });

         // formato v4
         test('Obtenemos la capa a partir de \'WMC*URL_CONTEXT\'', function () {
            var foundLayer = map.getWMC(WMC.concat('*').concat(URL_CONTEXT));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'wmC*URL_CONTEXT\'', function () {
            var foundLayer = map.getWMC(wmC.concat('*').concat(URL_CONTEXT));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'WMC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var foundLayer = map.getWMC(WMC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'wmC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var foundLayer = map.getWMC(wmC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });

         // Objeto
         test('Obtenemos la capa a partir de objeto (1.1): tipo \'WMC\', url y name', function () {
            var foundLayer = map.getWMC({
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
            var foundLayer = map.getWMC({
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
            var foundLayer = map.getWMC({
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
            var foundLayer = map.getWMC({
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
            var foundLayer = map.getWMC({
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
            var foundLayer = map.getWMC({
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
            var foundLayer = map.getWMC({
               type: WMC,
               url: URL_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (4.2): tipo \'wmC\' y URL', function () {
            var foundLayer = map.getWMC({
               type: wmC,
               url: URL_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (4.3): tipo M.layer.type.WMC y URL', function () {
            var foundLayer = map.getWMC({
               type: M.layer.type.WMC,
               url: URL_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (5.1): nombre', function () {
            var foundLayer = map.getWMC({
               name: NAME_CONTEXT
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (5.2): URL', function () {
            var foundLayer = map.getWMC({
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