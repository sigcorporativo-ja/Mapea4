(function (suiteModule) {
   suiteModule.object = function () {
      suite('Objeto con M.layer.WMC', function () {
         // formato v3
         test('Formato v3 (1): \'URL_CONTEXT*NAME_CONTEXT\'', function () {
            var layer = new M.layer.WMC(URL_CONTEXT.concat('*').concat(NAME_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Formato v3 (2): \'PREDEFINED_CONTEXT\'', function () {
            var layer = new M.layer.WMC(PREDEFINED_CONTEXT);
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         // formato v4
         test('Formato v4 (1): \'URL_CONTEXT\'', function () {
            var layer = new M.layer.WMC(URL_CONTEXT);
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Formato v4 (2.1): \'WMC*PREDEFINED_CONTEXT\'', function () {
            var layer = new M.layer.WMC(WMC.concat('*').concat(PREDEFINED_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Formato v4 (2.2): \'wmC*PREDEFINED_CONTEXT\'', function () {
            var layer = new M.layer.WMC(wmC.concat('*').concat(PREDEFINED_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Formato v4 (3.1): \'WMC*URL_CONTEXT\'', function () {
            var layer = new M.layer.WMC(WMC.concat('*').concat(URL_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Formato v4 (3.2): \'wmC*URL_CONTEXT\'', function () {
            var layer = new M.layer.WMC(wmC.concat('*').concat(URL_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Formato v4 (4.1): \'WMC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var layer = new M.layer.WMC(WMC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Formato v4 (4.2): \'wmC*URL_CONTEXT*NAME_CONTEXT\'', function () {
            var layer = new M.layer.WMC(wmC.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         // Objeto
         test('Objeto (1): url y name', function () {
            var layer = new M.layer.WMC({
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Objeto (2): nombre predefinido', function () {
            var layer = new M.layer.WMC({
               name: PREDEFINED_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Objeto (3): url', function () {
            var layer = new M.layer.WMC({
               url: URL_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Objeto (4.1): tipo \'WMC\', url y name', function () {
            var layer = new M.layer.WMC({
               type: WMC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Objeto (4.2): tipo \'wmC\', url y name', function () {
            var layer = new M.layer.WMC({
               type: wmC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Objeto (4.3): tipo M.layer.type.WMC, url y name', function () {
            var layer = new M.layer.WMC({
               type: M.layer.type.WMC,
               url: URL_CONTEXT,
               name: NAME_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, NAME_CONTEXT);
         });
         test('Objeto (5.1): tipo \'WMC\' y nombre predefinido', function () {
            var layer = new M.layer.WMC({
               type: WMC,
               name: PREDEFINED_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Objeto (5.2): tipo \'wmC\' y nombre predefinido', function () {
            var layer = new M.layer.WMC({
               type: wmC,
               name: PREDEFINED_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Objeto (5.3): tipo M.layer.type.WMC y nombre predefinido', function () {
            var layer = new M.layer.WMC({
               type: M.layer.type.WMC,
               name: PREDEFINED_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, null, PREDEFINED_CONTEXT_NAME);
         });
         test('Objeto (6.1): tipo \'WMC\' y URL', function () {
            var layer = new M.layer.WMC({
               type: WMC,
               url: URL_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Objeto (6.2): tipo \'wmC\' y URL', function () {
            var layer = new M.layer.WMC({
               type: wmC,
               url: URL_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Objeto (6.3): tipo M.layer.type.WMC y URL', function () {
            var layer = new M.layer.WMC({
               type: M.layer.type.WMC,
               url: URL_CONTEXT
            });
            suiteModule.asserts.layerIsWMC(layer, URL_CONTEXT, null);
         });
         test('Falla porque no especifico ningún parámetro', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC(null);
            });
         });
         test('Falla porque especifico un objeto vacío', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC({});
            });
         });
         test('Falla porque especifico un objeto con propiedades erróneas', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC({
                  nombre: NAME_CONTEXT,
                  URL: URL_CONTEXT
               });
            });
         });
         test('Falla porque especifico mal el orden de los parámetros de la cadena: NAME_CONTEXT*WMC*URL_CONTEXT', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC(NAME_CONTEXT.concat('*').concat(WMC).concat('*').concat(URL_CONTEXT));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC('tipoInexistente'.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC({
                  type: 'tipoInexistente',
                  url: URL_CONTEXT,
                  name: NAME_CONTEXT
               });
            });
         });
         test('Falla porque el tipo no es WMC (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC('KML'.concat('*').concat(URL_CONTEXT).concat('*').concat(NAME_CONTEXT));
            });
         });
         test('Falla porque el tipo no es WMC (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC({
                  type: 'KML',
                  url: URL_CONTEXT,
                  name: NAME_CONTEXT
               });
            });
         });
         test('Falla porque el tipo no es WMC (3)', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC({
                  type: M.layer.type.KML,
                  url: URL_CONTEXT,
                  name: NAME_CONTEXT
               });
            });
         });
         test('Falla porque especifico únicamente el nombre de un contexto que no es predefinodo', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC('nombreContextoNoPredefinido');
            });
         });
         test('Falla porque especifico únicamente el nombre de un contexto que no es predefinodo en el objeto', function () {
            assert.throw(function () {
               var layer = new M.layer.WMC({
                  name: 'nombreContextoNoPredefinido'
               });
            });
         });
      });
   };
})(window.mapeaSuite.wmc || {});