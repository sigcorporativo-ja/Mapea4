(function (suiteModule) {
   suiteModule.object = function () {
      suite('Objeto con M.layer.WMS', function () {
         // formato v3
         test('Formato v3 (1.1): \'WMS*NAME*URL*TITLE*TRANSPARENCE*TILED\'', function () {
            var layer = new M.layer.WMS(WMS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS);
         });
         test('Formato v3 (1.2): \'wmS*NAME*URL*TITLE*TRANSPARENCE*TILED\'', function () {
            var layer = new M.layer.WMS(wmS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS);
         });
         test('Formato v3 (1.3): \'WMS*NAME*URL*TITLE*TRANSPARENCE\'', function () {
            var layer = new M.layer.WMS(WMS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS);
         });
         test('Formato v3 (1.4): \'wmS*NAME*URL*TITLE*TRANSPARENCE\'', function () {
            var layer = new M.layer.WMS(wmS.concat('*').concat(TITLE_WMS)
               .concat('*').concat(URL_WMS).concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS);
         });
         test('Formato v3 (2.1): \'WMS_FULL*URL*TILED\'', function () {
            var layer = new M.layer.WMS(WMS_FULL.concat('*').concat(WMS_FULL_URL)
               .concat('*').concat(WMS_FULL_TILED));

            suiteModule.asserts.layerIsWMS(layer, null, WMS_FULL_URL, null,
               null, WMS_FULL_TILED);
         });
         test('Formato v3 (2.2): \'wmS_Full*URL*TILED\'', function () {
            var layer = new M.layer.WMS(wmS_Full.concat('*').concat(WMS_FULL_URL)
               .concat('*').concat(WMS_FULL_TILED));

            suiteModule.asserts.layerIsWMS(layer, null, WMS_FULL_URL, null,
               null, WMS_FULL_TILED);
         });
         test('Formato v3 (2.3): \'WMS_FULL*URL\'', function () {
            var layer = new M.layer.WMS(WMS_FULL.concat('*').concat(WMS_FULL_URL));

            suiteModule.asserts.layerIsWMS(layer, null, WMS_FULL_URL, null,
               null, WMS_FULL_TILED);
         });
         test('Formato v3 (2.4): \'wmS_Full*URL\'', function () {
            var layer = new M.layer.WMS(wmS_Full.concat('*').concat(WMS_FULL_URL));

            suiteModule.asserts.layerIsWMS(layer, null, WMS_FULL_URL, null,
               null, WMS_FULL_TILED);
         });

         // formato v4
         test('Formato v4 (1): \'URL*NAME*TITLE*TRANSPARENCE*TILED*CQL*VERSION\'', function () {
            var layer = new M.layer.WMS(URL_WMS.concat('*').concat(NAME_WMS)
               .concat('*').concat(TITLE_WMS).concat('*').concat(TRANSPARENCE_WMS)
               .concat('*').concat(TILED_WMS).concat('*').concat(CQL_WMS)
               .concat('*').concat(VERSION_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS, CQL_WMS, VERSION_WMS);
         });
         test('Formato v4 (2): \'URL*NAME*TRANSPARENCE*TILED*CQL*VERSION\'', function () {
            var layer = new M.layer.WMS(URL_WMS.concat('*').concat(NAME_WMS)
               .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS)
               .concat('*').concat(CQL_WMS).concat('*').concat(VERSION_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, null,
               TRANSPARENCE_WMS, TILED_WMS, CQL_WMS, VERSION_WMS);
         });
         test('Formato v4 (3): \'URL*TRANSPARENCE*TILED*CQL*VERSION\'', function () {
            var layer = new M.layer.WMS(URL_WMS.concat('*').concat(TRANSPARENCE_WMS)
               .concat('*').concat(TILED_WMS).concat('*').concat(CQL_WMS)
               .concat('*').concat(VERSION_WMS));

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               TRANSPARENCE_WMS, TILED_WMS, CQL_WMS, VERSION_WMS);
         });
         test('Formato v4 (4): \'URL*NAME*TITLE*CQL*VERSION\'', function () {
            var layer = new M.layer.WMS(URL_WMS.concat('*').concat(NAME_WMS)
               .concat('*').concat(TITLE_WMS).concat('*').concat(CQL_WMS)
               .concat('*').concat(VERSION_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               null, null, CQL_WMS, VERSION_WMS);
         });
         test('Formato v4 (5): \'URL*NAME*TITLE*VERSION\'', function () {
            var layer = new M.layer.WMS(URL_WMS.concat('*').concat(NAME_WMS)
               .concat('*').concat(TITLE_WMS).concat('*').concat(VERSION_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               null, null, null, VERSION_WMS);
         });
         test('Formato v4 (6): \'URL*NAME*TITLE\'', function () {
            var layer = new M.layer.WMS(URL_WMS.concat('*').concat(NAME_WMS)
               .concat('*').concat(TITLE_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               null, null, null, null);
         });
         test('Formato v4 (7): \'URL\'', function () {
            var layer = new M.layer.WMS(URL_WMS);

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Formato v4 (7): \'URL*TRANSPARENCE*TILED\'', function () {
            var layer = new M.layer.WMS(URL_WMS.concat('*').concat(TRANSPARENCE_WMS)
               .concat('*').concat(TILED_WMS));

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               TRANSPARENCE_WMS, TILED_WMS, null, null);
         });
         test('Formato v4 (8): \'URL*NAME*TITLE*CQL*VERSION\'', function () {
            var layer = new M.layer.WMS(URL_WMS.concat('*').concat(NAME_WMS)
               .concat('*').concat(TITLE_WMS).concat('*').concat(CQL_WMS)
               .concat('*').concat(VERSION_WMS));

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               null, null, CQL_WMS, VERSION_WMS);
         });

         // Objeto
         test('Objeto (1): url, name, legend, transparent, tiled, cql y version', function () {
            var layer = new M.layer.WMS({
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
            var layer = new M.layer.WMS({
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
         test('Objeto (1.3): url, name, legend, transparent, tiled, cql y version', function () {
            var layer = new M.layer.WMS({
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
         test('Objeto (1.4): url, name, legend, transparent, tiled, cql y version', function () {
            var layer = new M.layer.WMS({
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
         test('Objeto (2): url, name, legend, transparent, tiled, cql', function () {
            var layer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               transparent: TRANSPARENCE_WMS,
               tiled: TILED_WMS,
               cql: CQL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS, CQL_WMS, null);
         });
         test('Objeto (3): url, name, legend, transparent, tiled', function () {
            var layer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               transparent: TRANSPARENCE_WMS,
               tiled: TILED_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, TILED_WMS, null, null);
         });
         test('Objeto (4): url, name, legend, transparent', function () {
            var layer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS,
               transparent: TRANSPARENCE_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               TRANSPARENCE_WMS, null, null, null);
         });
         test('Objeto (5): url, name, legend', function () {
            var layer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS,
               legend: TITLE_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, TITLE_WMS,
               null, null, null, null);
         });
         test('Objeto (6): url, name', function () {
            var layer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (7): url, name, tiled y version', function () {
            var layer = new M.layer.WMS({
               url: URL_WMS,
               name: NAME_WMS,
               tiled: TILED_WMS,
               version: VERSION_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, NAME_WMS, URL_WMS, null,
               null, TILED_WMS, null, VERSION_WMS);
         });
         test('Objeto (8): url', function () {
            var layer = new M.layer.WMS({
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (8.2): url', function () {
            var layer = new M.layer.WMS({
               type: WMS_FULL,
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (8.3): url', function () {
            var layer = new M.layer.WMS({
               type: wmS_Full,
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (8.4): url', function () {
            var layer = new M.layer.WMS({
               type: M.layer.type.WMS,
               url: URL_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, null, null, null);
         });
         test('Objeto (9): url, tiled', function () {
            var layer = new M.layer.WMS({
               url: URL_WMS,
               tiled: TILED_WMS
            });

            suiteModule.asserts.layerIsWMS(layer, null, URL_WMS, null,
               null, TILED_WMS, null, null);
         });
         test('Falla porque no especifico ningún parámetro', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS(null);
            });
         });
         test('Falla porque especifico un objeto vacío', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS({});
            });
         });
         test('Falla porque especifico un objeto con propiedades erróneas', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS({
                  nombre: NAME_WMS,
                  URL: URL_WMS
               });
            });
         });
         test('Falla porque especifico mal el orden de los parámetros de la cadena: NAME*WMS*TITLE*URL*TRANSPARENCE*TILED', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS(NAME_WMS.concat('*').concat(WMS).concat('*')
                  .concat(TITLE_WMS).concat('*').concat(URL_WMS).concat('*').concat(TRANSPARENCE_WMS)
                  .concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS('tipoInexistente'.concat('*').concat(NAME_WMS)
                  .concat('*').concat(URL_WMS).concat('*').concat(TITLE_WMS)
                  .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS({
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
         test('Falla porque el tipo no es WMS (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS('KML'.concat('*').concat(NAME_WMS)
                  .concat('*').concat(URL_WMS).concat('*').concat(TITLE_WMS)
                  .concat('*').concat(TRANSPARENCE_WMS).concat('*').concat(TILED_WMS));
            });
         });
         test('Falla porque el tipo no es WMS (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS({
                  type: 'KML',
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
         test('Falla porque el tipo no es WMS (3)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMS({
                  type: M.layer.type.KML,
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