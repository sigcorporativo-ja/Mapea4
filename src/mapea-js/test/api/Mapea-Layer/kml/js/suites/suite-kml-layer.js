(function (suiteModule) {
   suiteModule.layer = function () {
      suite('Objeto con M.layer', function () {
         // formato v3
         test('Formato v3 (1.1): \'KML*NAME*DIR*FILENAME*EXTRACT\'', function () {
            var layer = M.layer(KML.concat('*').concat(NAME_KML)
               .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
               .concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, NAME_KML, DIR_KML, FILENAME_KML,
               EXTRACT_ATTRIBUTES);
         });
         test('Formato v3 (1.2): \'kmL*NAME*DIR*FILENAME*EXTRACT\'', function () {
            var layer = M.layer(kmL.concat('*').concat(NAME_KML)
               .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
               .concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, NAME_KML, DIR_KML, FILENAME_KML,
               EXTRACT_ATTRIBUTES);
         });
         test('Formato v3 (1.3): \'KML*NAME*URL*EXTRACT\'', function () {
            var layer = M.layer(KML.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         test('Formato v3 (1.3): \'kmL*NAME*URL*EXTRACT\'', function () {
            var layer = M.layer(kmL.concat('*').concat(NAME_KML)
               .concat('*').concat(URL_KML).concat('*').concat(EXTRACT_ATTRIBUTES));

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         // Objeto
         test('Objeto (1): type, name, url, extract', function () {
            var layer = M.layer({
               type: KML,
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         test('Objeto (1.2): type, name, url, extract', function () {
            var layer = M.layer({
               type: kmL,
               url: URL_KML,
               name: NAME_KML,
               extract: EXTRACT_ATTRIBUTES
            });

            suiteModule.asserts.layerIsKML(layer, NAME_KML, URL_KML, null,
               EXTRACT_ATTRIBUTES);
         });
         test('Falla porque no especifico ningún parámetro', function () {
            assert.throw(function () {
               var layer = M.layer();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               var layer = M.layer(null);
            });
         });
         test('Falla porque especifico un objeto vacío', function () {
            assert.throw(function () {
               var layer = M.layer({});
            });
         });
         test('Falla porque especifico mal el orden de los parámetros de la cadena: NAME*KML*FILENAME*DIR*EXTRACT', function () {
            assert.throw(function () {
               var layer = M.layer(NAME_KML.concat('*').concat(KML)
                  .concat('*').concat(FILENAME_KML).concat('*').concat(DIR_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (1)', function () {
            assert.throw(function () {
               var layer = new M.layer('tipoInexistente'.concat('*').concat(NAME_KML)
                  .concat('*').concat(DIR_KML).concat('*').concat(FILENAME_KML)
                  .concat('*').concat(EXTRACT_ATTRIBUTES));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (2)', function () {
            assert.throw(function () {
               var layer = M.layer({
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