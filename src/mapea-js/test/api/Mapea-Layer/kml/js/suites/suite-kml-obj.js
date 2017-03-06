(function (suiteModule) {
   suiteModule.object = function () {
      suite('Objeto con M.layer.KML', function () {
         // formato v3
         test('Formato v3 (1.1): \'KML*NAME*DIR*FILENAME*EXTRACT\'', function () {
            var layer = new M.layer.KML(KML.concat('*').concat(NAME_KML)
               .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
               .concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, NAME_KML, DIR_KML, FILENAME_KML,
               EXTRACT_ATTRIBUTES);
         });
         test('Formato v3 (1.2): \'kmL*NAME*DIR*FILENAME*EXTRACT\'', function () {
            var layer = new M.layer.KML(kmL.concat('*').concat(NAME_KML)
               .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
               .concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, NAME_KML, DIR_KML, FILENAME_KML,
               EXTRACT_ATTRIBUTES);
         });
         test('Formato v3 (1.3): \'KML*NAME*URL*EXTRACT\'', function () {
            var layer = new M.layer.KML(KML.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         test('Formato v3 (1.3): \'kmL*NAME*URL*EXTRACT\'', function () {
            var layer = new M.layer.KML(kmL.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         // formato v4
         test('Formato v4 (1): \'URL*EXTRACT\'', function () {
            var layer = new M.layer.KML(URL_KML.concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, null, URL_KML, null, EXTRACT_ATTRIBUTES);
         });
         test('Formato v4 (2): \'URL\'', function () {
            var layer = new M.layer.KML(URL_KML);

            suiteModule.asserts.layerIsKML(layer, null, URL_KML);
         });
         // Objeto
         test('Objeto (1): type, name, url, extract', function () {
            var layer = new M.layer.KML({
               type: KML,
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         test('Objeto (1.2): type, name, url, extract', function () {
            var layer = new M.layer.KML({
               type: kmL,
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         test('Objeto (2): name, url, extract', function () {
            var layer = new M.layer.KML({
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         test('Objeto (3): name, url', function () {
            var layer = new M.layer.KML({
               url: URL_KML,
               name: NAME_KML
            });

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML);
         });
         test('Objeto (4): url, extract', function () {
            var layer = new M.layer.KML({
               url: URL_KML,
               extract: EXTRACT_ATTRIBUTES
            });

            suiteModule.asserts.layerIsKML(layer, null, URL_KML, null, EXTRACT_ATTRIBUTES);
         });
         test('Objeto (5): url', function () {
            var layer = new M.layer.KML({
               url: URL_KML
            });

            suiteModule.asserts.layerIsKML(layer, null, URL_KML);
         });

         test('Falla porque no especifico ningún parámetro', function () {
            assert.throw(function () {
               var layer = new M.layer.KML();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               var layer = new M.layer.KML(null);
            });
         });
         test('Falla porque especifico un objeto vacío', function () {
            assert.throw(function () {
               var layer = new M.layer.KML({});
            });
         });
         test('Falla porque especifico mal el orden de los parámetros de la cadena: NAME*KML*FILENAME*DIR*EXTRACT', function () {
            assert.throw(function () {
               var layer = new M.layer.KML(NAME_KML.concat('*').concat(KML)
                  .concat('*').concat(FILENAME_KML).concat('*').concat(DIR_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.KML('tipoInexistente'.concat('*').concat(NAME_KML)
                  .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.KML({
                  type: 'tipoInexistente',
                  url: URL_KML,
                  name: NAME_KML,
                  extract: EXTRACT_ATTRIBUTES
               });
            });
         });
         test('Falla porque el tipo no es KML (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.KML('WMS'.concat('*').concat(NAME_KML)
                  .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque el tipo no es KML (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.KML({
                  type: 'WMS',
                  url: URL_KML,
                  name: NAME_KML,
                  extract: EXTRACT_ATTRIBUTES
               });
            });
         });
         test('Falla porque el tipo no es KML (3)', function () {
            assert.throw(function () {
               var layer = new M.layer.KML({
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