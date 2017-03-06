(function (suiteModule) {
   suiteModule.getLayers = function () {
      suite('Método getLayers', function () {
         var layer, layerPredefined;

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
         });

         test('Obtenemos la capa a partir de \'WMS*NAME*URL*TITLE*TRANSPARENCE*TILED\'', function () {
            var foundLayer = map.getLayers(WMS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'wmS*NAME*URL*TITLE*TRANSPARENCE*TILED\'', function () {
            var foundLayer = map.getLayers(wmS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'WMS*TITLE*URL\'', function () {
            var foundLayer = map.getLayers(WMS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'wmS*TITLE*URL\'', function () {
            var foundLayer = map.getLayers(wmS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });

         // Objeto
         test('Obtenemos la capa a partir de objeto (1.1): tipo \'WMS\', url y name', function () {
            var foundLayer = map.getLayers({
               type: WMS,
               url: URL_WMS,
               name: NAME_WMS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (1.2): tipo \'wmS\', url y name', function () {
            var foundLayer = map.getLayers({
               type: wmS,
               url: URL_WMS,
               name: NAME_WMS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (1.3): tipo M.layer.type.WMS, url y name', function () {
            var foundLayer = map.getLayers({
               type: M.layer.type.WMS,
               url: URL_WMS,
               name: NAME_WMS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (2.1): tipo \'WMS\'', function () {
            var foundLayer = map.getLayers({
               type: WMS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layer2.name);
            assert.strictEqual(foundLayer[1].url, layer2.url);
            assert.strictEqual(foundLayer[1].type, layer2.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo WMS');
         });
         test('Obtenemos la capa a partir de objeto (2.2): tipo \'wmS\'', function () {
            var foundLayer = map.getLayers({
               type: wmS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layer2.name);
            assert.strictEqual(foundLayer[1].url, layer2.url);
            assert.strictEqual(foundLayer[1].type, layer2.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo WMS');
         });
         test('Obtenemos la capa a partir de objeto (2.3): tipo M.layer.type.WMS', function () {
            var foundLayer = map.getLayers({
               type: M.layer.type.WMS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layer2.name);
            assert.strictEqual(foundLayer[1].url, layer2.url);
            assert.strictEqual(foundLayer[1].type, layer2.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo WMS');
         });
         test('Obtenemos la capa a partir de objeto (4.1): tipo \'WMS\' y URL', function () {
            var foundLayer = map.getLayers({
               type: WMS,
               url: URL_WMS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (4.2): tipo \'wmS\' y URL', function () {
            var foundLayer = map.getLayers({
               type: wmS,
               url: URL_WMS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (4.3): tipo M.layer.type.WMS y URL', function () {
            var foundLayer = map.getLayers({
               type: M.layer.type.WMS,
               url: URL_WMS
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
      });
   };
})(window.mapeaSuite.wms || {});