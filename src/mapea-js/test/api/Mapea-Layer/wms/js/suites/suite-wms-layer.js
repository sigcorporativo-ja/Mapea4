(function (suiteModule) {
   suiteModule.layer = function () {
      suite('Objeto con método M.layer', function () {
         // formato v3
         test('Formato v3 (1.1): \'WMS*NAME*URL*TITLE*TRANSPARENCE*TILED\'', function () {
            var layer = M.layer(WMS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS);
         });
         test('Formato v3 (1.2): \'wmS*NAME*URL*TITLE*TRANSPARENCE*TILED\'', function () {
            var layer = M.layer(wmS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS);
         });
         test('Formato v3 (1.3): \'WMS*NAME*URL*TITLE*TRANSPARENCE\'', function () {
            var layer = M.layer(WMS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS);
         });
         test('Formato v3 (1.4): \'wmS*NAME*URL*TITLE*TRANSPARENCE\'', function () {
            var layer = M.layer(wmS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS);
         });
         test('Formato v3 (2.1): \'WMS_FULL*URL*TILED\'', function () {
            var layer = M.layer(WMS_FULL.concat('*').concat(WMS_FULL_URL)
               .concat('*').concat(WMS_FULL_TILED));

            suiteModule.asserts.layerIsWMS(layer, null, WMS_FULL_URL, null,
               null, WMS_FULL_TILED);
         });
         test('Formato v3 (2.2): \'wmS_Full*URL*TILED\'', function () {
            var layer = M.layer(wmS_Full.concat('*').concat(WMS_FULL_URL)
               .concat('*').concat(WMS_FULL_TILED));

            suiteModule.asserts.layerIsWMS(layer, null, WMS_FULL_URL, null,
               null, WMS_FULL_TILED);
         });
         test('Formato v3 (2.3): \'WMS_FULL*URL\'', function () {
            var layer = M.layer(WMS_FULL.concat('*').concat(WMS_FULL_URL));

            suiteModule.asserts.layerIsWMS(layer, null, WMS_FULL_URL, null,
               null, WMS_FULL_TILED);
         });
         test('Formato v3 (2.4): \'wmS_Full*URL\'', function () {
            var layer = M.layer(wmS_Full.concat('*').concat(WMS_FULL_URL));

            suiteModule.asserts.layerIsWMS(layer, null, WMS_FULL_URL, null,
               null, WMS_FULL_TILED);
         });
         // Objeto
         test('Objeto (1.1): url, name, legend, transparent, tiled, cql y version', function () {
            var layer = M.layer({
               type: WMS,
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               transparent: TRANSPARENCE_WMS,
               tiled: TILED_WMS,
               cql: CQL_WMS,
               version: VERSION_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS, CQL_WMS, VERSION_WMS);
         });
         test('Objeto (1.2): url, name, legend, transparent, tiled, cql y version', function () {
            var layer = M.layer({
               type: wmS,
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               transparent: TRANSPARENCE_WMS,
               tiled: TILED_WMS,
               cql: CQL_WMS,
               version: VERSION_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS, CQL_WMS, VERSION_WMS);
         });
         test('Objeto (1.3): url, name, legend, transparent, tiled, cql y version', function () {
            var layer = M.layer({
               type: M.layer.type.WMS,
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               transparent: TRANSPARENCE_WMS,
               tiled: TILED_WMS,
               cql: CQL_WMS,
               version: VERSION_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS, CQL_WMS, VERSION_WMS);
         });
         test('Objeto (2.1): url', function () {
            var layer = M.layer({
               type: WMS,
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (2.2): url', function () {
            var layer = M.layer({
               type: wmS,
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (2.3): url', function () {
            var layer = M.layer({
               type: M.layer.type.WMS,
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (2.4): url', function () {
            var layer = M.layer({
               type: WMS_FULL,
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (2.5): url', function () {
            var layer = M.layer({
               type: wmS_Full,
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (3.1): url, tiled', function () {
            var layer = M.layer({
               type: WMS,
               url: URL_WMS,
               tiled: TILED_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, TILED_WMS, null, null);
         });
         test('Objeto (2.2): url, tiled', function () {
            var layer = M.layer({
               type: wmS,
               url: URL_WMS,
               tiled: TILED_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, TILED_WMS, null, null);
         });
         test('Objeto (2.3): url, tiled', function () {
            var layer = M.layer({
               type: M.layer.type.WMS,
               url: URL_WMS,
               tiled: TILED_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, TILED_WMS, null, null);
         });
         test('Objeto (2.4): url, tiled', function () {
            var layer = M.layer({
               type: WMS_FULL,
               url: URL_WMS,
               tiled: TILED_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, TILED_WMS, null, null);
         });
         test('Objeto (2.5): url, tiled', function () {
            var layer = M.layer({
               type: wmS_Full,
               url: URL_WMS,
               tiled: TILED_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, TILED_WMS, null, null);
         });
         test('Falla porque especifico mal el orden de los parámetros de la cadena: NAME*WMS*TITLE*URL*TRANSPARENCE*TILED', function () {
            assert.throw(function () {
               var layer = M.layer(NAME_WMS.concat('*').concat(WMS).concat('*')
                  .concat(TITLE_WMS).concat('*').concat(URL_WMS).concat('*').concat(TRANSPARENCE_WMS)
                  .concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (1)', function () {
            assert.throw(function () {
               var layer = M.layer('tipoInexistente'.concat('*').concat(NAME_WMS)
                  .concat('*').concat(URL_WMS).concat('*').concat(TITLE_WMS)
                  .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (2)', function () {
            assert.throw(function () {
               var layer = M.layer({
                  type: 'tipoInexistente',
                  url: URL_WMS,
                  name: NAME_WMS,
                  legend: TITLE_WMS,
                  transparent: TRANSPARENCE_WMS,
                  tiled: TILED_WMS,
                  cql: CQL_WMS,
                  version: VERSION_WMS
               });
            });
         });
         test('Falla porque no se especifica el tipo (1)', function () {
            assert.throw(function () {
               var layer = M.layer(NAME_WMS.concat('*').concat(URL_WMS).concat('*').concat(TITLE_WMS)
                  .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque no se especifica el tipo (2)', function () {
            assert.throw(function () {
               var layer = M.layer({
                  url: URL_WMS,
                  name: NAME_WMS,
                  legend: TITLE_WMS,
                  transparent: TRANSPARENCE_WMS,
                  tiled: TILED_WMS,
                  cql: CQL_WMS,
                  version: VERSION_WMS
               });
            });
         });
      });
   };
})(window.mapeaSuite.wms || {});