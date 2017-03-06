(function (suiteModule) {
   suiteModule.getKML = function () {
      suite('Método getKML', function () {
         var layer, layer2;

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
         });

         // formato v3
         test('Obtenemos la capa añadida por URL', function () {
            var foundLayer = map.getKML(URL_KML);
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa añadida por nombre', function () {
            var foundLayer = map.getKML(NAME_KML);
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });

         // formato v4
         test('Obtenemos la capa a partir de \'KML*NAME*DIR*FILENAME*EXTRACT\'', function () {
            var foundLayer = map.getKML(KML.concat('*').concat(NAME_KML)
               .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
               .concat('*').concat(EXTRACT_ATTRIBUTES));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'kmL*NAME*DIR*FILENAME*EXTRACT\'', function () {
            var foundLayer = map.getKML(kmL.concat('*').concat(NAME_KML)
               .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
               .concat('*').concat(EXTRACT_ATTRIBUTES));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'KML*NAME*URL*EXTRACT\'', function () {
            var foundLayer = map.getKML(KML.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'kmL*NAME*URL*EXTRACT\'', function () {
            var foundLayer = map.getKML(kmL.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'URL*EXTRACT\'', function () {
            var foundLayer = map.getKML(URL_KML.concat('*').concat(EXTRACT_ATTRIBUTES));
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de \'URL\'', function () {
            var foundLayer = map.getKML(URL_KML);
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });

         // Objeto
         test('Obtenemos la capa a partir de objeto (1.1): tipo \'KML\', url y name', function () {
            var foundLayer = map.getKML({
               type: KML,
               url: URL_KML,
               name: NAME_KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (1.2): tipo \'kmL\', url y name', function () {
            var foundLayer = map.getKML({
               type: kmL,
               url: URL_KML,
               name: NAME_KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (1.3): tipo M.layer.type.KML, url y name', function () {
            var foundLayer = map.getKML({
               type: M.layer.type.KML,
               url: URL_KML,
               name: NAME_KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (2.1): tipo \'KML\'', function () {
            var foundLayer = map.getKML({
               type: KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layer2.name);
            assert.strictEqual(foundLayer[1].url, layer2.url);
            assert.strictEqual(foundLayer[1].type, layer2.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo KML');
         });
         test('Obtenemos la capa a partir de objeto (2.2): tipo \'kmL\'', function () {
            var foundLayer = map.getKML({
               type: kmL
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layer2.name);
            assert.strictEqual(foundLayer[1].url, layer2.url);
            assert.strictEqual(foundLayer[1].type, layer2.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo KML');
         });
         test('Obtenemos la capa a partir de objeto (2.3): tipo M.layer.type.KML', function () {
            var foundLayer = map.getKML({
               type: M.layer.type.KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer[1].name, layer2.name);
            assert.strictEqual(foundLayer[1].url, layer2.url);
            assert.strictEqual(foundLayer[1].type, layer2.type);
            assert.strictEqual(foundLayer.length, 2, 'dos capas son de tipo KML');
         });
         test('Obtenemos la capa a partir de objeto (4.1): tipo \'KML\' y URL', function () {
            var foundLayer = map.getKML({
               type: KML,
               url: URL_KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (4.2): tipo \'kmL\' y URL', function () {
            var foundLayer = map.getKML({
               type: kmL,
               url: URL_KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (4.3): tipo M.layer.type.KML y URL', function () {
            var foundLayer = map.getKML({
               type: M.layer.type.KML,
               url: URL_KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (5.1): nombre', function () {
            var foundLayer = map.getKML({
               name: NAME_KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
         test('Obtenemos la capa a partir de objeto (5.2): URL', function () {
            var foundLayer = map.getKML({
               url: URL_KML
            });
            assert.strictEqual(foundLayer[0].name, layer.name);
            assert.strictEqual(foundLayer[0].url, layer.url);
            assert.strictEqual(foundLayer[0].type, layer.type);
            assert.strictEqual(foundLayer.length, 1, 'sólo una capa coincide con el criterio de búsqueda');
         });
      });
   };
})(window.mapeaSuite.kml || {});