(function (suiteModule) {
   suiteModule.object = function () {
      suite('Objeto con M.layer.WFS', function () {
         // String
         test('String (1.1): \'WMTS*URL*NAME*MATRIXSET*TITLE\'', function () {
            var layer = new M.layer.WMTS(WMTS.concat('*').concat(URL)
               .concat('*').concat(NAME).concat('*').concat(MATRIXSET)
               .concat('*').concat(TITLE));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET, TITLE);
         });
         test('String (1.2): \'wmTS*URL*NAME*MATRIXSET*TITLE\'', function () {
            var layer = new M.layer.WMTS(wmTS.concat('*').concat(URL)
               .concat('*').concat(NAME).concat('*').concat(MATRIXSET)
               .concat('*').concat(TITLE));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET, TITLE);
         });
         test('String (2.1): \'WMTS*URL*NAME*MATRIXSET\'', function () {
            var layer = new M.layer.WMTS(WMTS.concat('*').concat(URL)
               .concat('*').concat(NAME).concat('*').concat(MATRIXSET));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET);
         });
         test('String (2.2): \'wmTS*URL*NAME*MATRIXSET\'', function () {
            var layer = new M.layer.WMTS(wmTS.concat('*').concat(URL)
               .concat('*').concat(NAME).concat('*').concat(MATRIXSET));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET);
         });
         test('String (3.1): \'WMTS*URL*NAME**TITLE\'', function () {
            var layer = new M.layer.WMTS(WMTS.concat('*').concat(URL)
               .concat('*').concat(NAME).concat('*').concat('*').concat(TITLE));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, null, TITLE);
         });
         test('String (3.2): \'wmTS*URL*NAME**TITLE\'', function () {
            var layer = new M.layer.WMTS(wmTS.concat('*').concat(URL)
               .concat('*').concat(NAME).concat('*').concat('*').concat(TITLE));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, null, TITLE);
         });
         test('String (4.1): \'WMTS*URL*NAME\'', function () {
            var layer = new M.layer.WMTS(WMTS.concat('*').concat(URL)
               .concat('*').concat(NAME));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME);
         });
         test('String (4.2): \'wmTS*URL*NAME\'', function () {
            var layer = new M.layer.WMTS(wmTS.concat('*').concat(URL)
               .concat('*').concat(NAME));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME);
         });
         test('String (4): \'URL*NAME*MATRIXSET*TITLE\'', function () {
            var layer = new M.layer.WMTS(URL.concat('*').concat(NAME)
               .concat('*').concat(MATRIXSET).concat('*').concat(TITLE));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET, TITLE);
         });
         test('String (5): \'URL*NAME*MATRIXSET\'', function () {
            var layer = new M.layer.WMTS(URL.concat('*').concat(NAME)
               .concat('*').concat(MATRIXSET));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET);
         });
         test('String (6): \'URL*NAME**TITLE\'', function () {
            var layer = new M.layer.WMTS(URL.concat('*').concat(NAME)
               .concat('*').concat('*').concat(TITLE));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, null, TITLE);
         });
         test('String (7): \'URL*NAME\'', function () {
            var layer = new M.layer.WMTS(URL.concat('*').concat(NAME));

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME);
         });
         // Objeto
         test('Objeto (1.1): type, url, name, matrixSet, title', function () {
            var layer = new M.layer.WMTS({
               type: WMTS,
               url: URL,
               name: NAME,
               matrixSet: MATRIXSET,
               legend: TITLE
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET, TITLE);
         });
         test('Objeto (1.2): type, url, name, matrixSet, title', function () {
            var layer = new M.layer.WMTS({
               type: wmTS,
               url: URL,
               name: NAME,
               matrixSet: MATRIXSET,
               legend: TITLE
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET, TITLE);
         });
         test('Objeto (1.3): type, url, name, matrixSet, title', function () {
            var layer = new M.layer.WMTS({
               type: M.layer.type.WMTS,
               url: URL,
               name: NAME,
               matrixSet: MATRIXSET,
               legend: TITLE
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET, TITLE);
         });
         test('Objeto (2.1): type, url, name, matrixSet', function () {
            var layer = new M.layer.WMTS({
               type: WMTS,
               url: URL,
               name: NAME,
               matrixSet: MATRIXSET
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET);
         });
         test('Objeto (2.2): type, url, name, matrixSet', function () {
            var layer = new M.layer.WMTS({
               type: wmTS,
               url: URL,
               name: NAME,
               matrixSet: MATRIXSET
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET);
         });
         test('Objeto (2.3): type, url, name, matrixSet', function () {
            var layer = new M.layer.WMTS({
               type: M.layer.type.WMTS,
               url: URL,
               name: NAME,
               matrixSet: MATRIXSET
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET);
         });
         test('Objeto (3.1): type, url, name, title', function () {
            var layer = new M.layer.WMTS({
               type: WMTS,
               url: URL,
               name: NAME,
               legend: TITLE
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, null, TITLE);
         });
         test('Objeto (3.2): type, url, name, title', function () {
            var layer = new M.layer.WMTS({
               type: wmTS,
               url: URL,
               name: NAME,
               legend: TITLE
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, null, TITLE);
         });
         test('Objeto (3.3): type, url, name, title', function () {
            var layer = new M.layer.WMTS({
               type: M.layer.type.WMTS,
               url: URL,
               name: NAME,
               legend: TITLE
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, null, TITLE);
         });
         test('Objeto (4.1): type, url, name', function () {
            var layer = new M.layer.WMTS({
               type: WMTS,
               url: URL,
               name: NAME
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME);
         });
         test('Objeto (4.2): type, url, name', function () {
            var layer = new M.layer.WMTS({
               type: wmTS,
               url: URL,
               name: NAME
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME);
         });
         test('Objeto (4.3): type, url, name', function () {
            var layer = new M.layer.WMTS({
               type: M.layer.type.WMTS,
               url: URL,
               name: NAME
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME);
         });
         test('Objeto (5): url, name, matrixSet, title', function () {
            var layer = new M.layer.WMTS({
               url: URL,
               name: NAME,
               matrixSet: MATRIXSET,
               legend: TITLE
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET, TITLE);
         });
         test('Objeto (6): url, name, matrixSet', function () {
            var layer = new M.layer.WMTS({
               url: URL,
               name: NAME,
               matrixSet: MATRIXSET
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, MATRIXSET);
         });
         test('Objeto (5): url, name, title', function () {
            var layer = new M.layer.WMTS({
               url: URL,
               name: NAME,
               legend: TITLE
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME, null, TITLE);
         });
         test('Objeto (5): url, name', function () {
            var layer = new M.layer.WMTS({
               url: URL,
               name: NAME
            });

            suiteModule.asserts.layerIsWMTS(layer, URL, NAME);
         });
         test('Falla porque no especifico ningún parámetro', function () {
            assert.throw(function () {
               var layer = new M.layer.WMTS();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               var layer = new M.layer.WMTS(null);
            });
         });
         test('Falla porque especifico un objeto vacío', function () {
            assert.throw(function () {
               var layer = new M.layer.WMTS({});
            });
         });
         test('Falla porque especifico un objeto con propiedades erróneas', function () {
            assert.throw(function () {
               var layer = new M.layer.WMTS({
                  nombre: NAME,
                  URL: URL
               });
            });
         });
         test('Falla porque especifico mal el orden de los parámetros de la cadena: NAME*WFST*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2', function () {
            assert.throw(function () {
               var layer = new M.layer.WMTS(TITLE_POINT.concat('*').concat(WFST)
                  .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
                  .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
                  .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS('tipoInexistente'.concat('*').concat(TITLE_POINT)
                  .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
                  .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
                  .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS({
                  type: 'tipoInexistente',
                  url: URL_LINE,
                  namespace: NAMESPACE_LINE,
                  name: NAME_LINE,
                  legend: TITLE_LINE,
                  cql: CQL_LINE,
                  geometry: GEOM_LINE,
                  ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
                  version: VERSION_LINE
               });
            });
         });
         test('Falla porque el tipo no es WMS (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS('KML'.concat('*').concat(TITLE_POINT)
                  .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
                  .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
                  .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));
            });
         });
         test('Falla porque el tipo no es WMS (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS({
                  type: 'KML',
                  url: URL_LINE,
                  namespace: NAMESPACE_LINE,
                  name: NAME_LINE,
                  legend: TITLE_LINE,
                  cql: CQL_LINE,
                  geometry: GEOM_LINE,
                  ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
                  version: VERSION_LINE
               });
            });
         });
         test('Falla porque el tipo no es WMS (3)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS({
                  type: M.layer.type.KML,
                  url: URL_LINE,
                  namespace: NAMESPACE_LINE,
                  name: NAME_LINE,
                  legend: TITLE_LINE,
                  cql: CQL_LINE,
                  geometry: GEOM_LINE,
                  ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
                  version: VERSION_LINE
               });
            });
         });
      });
   };
})(window.mapeaSuite.wmts || {});