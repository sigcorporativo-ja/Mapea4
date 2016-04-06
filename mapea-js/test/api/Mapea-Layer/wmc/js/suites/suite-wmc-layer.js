(function (suiteModule) {
   suiteModule.layer = function () {
      suite('Objeto con método M.layer', function () {
         // formato v4
         test('Formato v4 (1.1): \'WMC*PREDEFINED_CONTEXT\'', function () {
            var layer = M.layer(WMC.concat('*').concat(PREDEFINED_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Formato v4 (1.2): \'wmC*PREDEFINED_CONTEXT\'', function () {
            var layer = M.layer(wmC.concat('*').concat(PREDEFINED_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Formato v4 (2.1): \'WMC*URL_CONTEXT\'', function () {
            var layer = M.layer(WMC.concat('*').concat(URL_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Formato v4 (2.2): \'wmC*URL_CONTEXT\'', function () {
            var layer = M.layer(wmC.concat('*').concat(URL_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Formato v4 (3.1): \'WMC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var layer = M.layer(WMC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Formato v4 (3.2): \'wmC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var layer = M.layer(wmC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         // Objeto
         test('Objeto (1.1): tipo \'WMC\', url y name', function () {
            var layer = M.layer({
               type: WMC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Objeto (1.2): tipo \'wmC\', url y name', function () {
            var layer = M.layer({
               type: wmC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Objeto (1.3): tipo M.layer.type.WMC, url y name', function () {
            var layer = M.layer({
               type: M.layer.type.WMC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Objeto (2.1): tipo \'WMC\' y nombre predefinido', function () {
            var layer = M.layer({
               type: WMC,
               name: PREDEFINED_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Objeto (2.2): tipo \'wmC\' y nombre predefinido', function () {
            var layer = M.layer({
               type: wmC,
               name: PREDEFINED_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Objeto (2.3): tipo M.layer.type.WMC y nombre predefinido', function () {
            var layer = M.layer({
               type: M.layer.type.WMC,
               name: PREDEFINED_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Objeto (3.1): tipo \'WMC\' y URL', function () {
            var layer = M.layer({
               type: WMC,
               url: URL_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Objeto (3.2): tipo \'wmC\' y URL', function () {
            var layer = M.layer({
               type: wmC,
               url: URL_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Objeto (3.3): tipo M.layer.type.WMC y URL', function () {
            var layer = M.layer({
               type: M.layer.type.WMC,
               url: URL_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
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
         test('Falla porque especifico un objeto con propiedades erróneas', function () {
            assert.throw(function () {
               var layer = M.layer({
                  nombre: NAME_CONTEXT,
                  URL: URL_CONTEXT
               });
            });
         });
         test('Falla porque especifico mal el orden de los parámetros de la cadena: NAME_CONTEXT*WMC*URL_CONTEXT', function () {
            assert.throw(function () {
               var layer = M.layer(NAME_CONTEXT.concat('*').concat(WMC).concat('*').concat(URL_CONTEXT));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (1)', function () {
            assert.throw(function () {
               var layer = M.layer('tipoInexistente'.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (2)', function () {
            assert.throw(function () {
               var layer = M.layer({
                  type: 'tipoInexistente',
                  url: URL_CONTEXT,
                  name: NAME_CONTEXT
               });
            });
         });
         test('Falla porque no se especifica el tipo (1)', function () {
            assert.throw(function () {
               var layer = M.layer(URL_CONTEXT.concat('*').concat(NAME_CONTEXT));
            });
         });
         test('Falla porque no se especifica el tipo (2)', function () {
            assert.throw(function () {
               var layer = M.layer({
                  url: URL_CONTEXT,
                  name: NAME_CONTEXT
               });
            });
         });
         test('Falla porque especifico únicamente el nombre de un contexto que no es predefinodo', function () {
            assert.throw(function () {
               var layer = M.layer(WMC.concat('*').concat('nombreContextoNoPredefinido'));
            });
         });
         test('Falla porque especifico únicamente el nombre de un contexto que no es predefinodo en el objeto', function () {
            assert.throw(function () {
               var layer = M.layer({
                  type: WMC,
                  name: 'nombreContextoNoPredefinido'
               });
            });
         });
      });
   };
})(window.mapeaSuite.wmc || {});