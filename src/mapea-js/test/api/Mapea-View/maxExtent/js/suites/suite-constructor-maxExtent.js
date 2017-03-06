(function (suiteModule) {
   suiteModule.constructorMaxExtent = function () {
      suite('Constructor con parámetro \'maxExtent\'', function () {

         test('Constructor a partir de maxExtent con array de numeros', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               maxExtent: EXTENT_ARRAY
            });

            var maxExtent = mapa.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('Constructor a partir de maxExtent con array de string', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               maxExtent: EXTENT_ARRAY_STRING
            });

            var maxExtent = mapa.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('Constructor a partir de maxExtent con string separados por (,)', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               maxExtent: EXTENT_STRING_COMA
            });

            var maxExtent = mapa.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('Constructor a partir de maxExtent con string separados por (;)', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               maxExtent: EXTENT_STRING_PUNTOYCOMA
            });

            var maxExtent = mapa.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('Constructor a partir de maxExtent con objeto {left, bottom, right, top}', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               maxExtent: EXTENT_OBJETO
            });

            var maxExtent = mapa.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('Constructor a partir de maxExtent con objeto {x, y}', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               maxExtent: GET_MAX_EXTENT
            });

            var maxExtent = mapa.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('Falla porque especifico un parámetro objeto vacío', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  maxExtent: {}
               });
            });
         });
         test('Falla porque especifico un array con 3 coordenadas', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  maxExtent: [3917476.4415233, 60109.617681153, 4361362.3476771]
               });
            });
         });
         test('Falla porque especifico un array de cadenas', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  maxExtent: ['3x917476.4415233', '60109x.617681153', '43613s62.3476771', 'ah']
               });
            });
         });
         test('Falla porque especifico un string con 3 coordenadas', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  maxExtent: '3917476.4415233,60109.617681153,4361362.3476771'
               });
            });
         });
         test('Falla porque especifico un string con coordenadas con separador invalido', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  maxExtent: '3917476.4415233*60109.617681153*4361362.3476771*650113.72970273'
               });
            });
         });
         test('Falla porque especifico un objeto con nulos (1)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  maxExtent: {
                     left: null,
                     bottom: null,
                     right: null,
                     top: null
                  }
               });
            });
         });
         test('Falla porque especifico un objeto con nulos (2)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  maxExtent: {
                     x: {
                        min: null,
                        max: null
                     },
                     y: {
                        min: null,
                        max: null
                     }
                  }
               });
            });
         });
         test('Falla porque especifico un objeto con propiedades erroneas', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  maxExtent: {
                     xmin: 60109.617681153,
                     ymin: 3917476.4415233,
                     xmax: 650113.72970273,
                     ymax: 4361362.3476771
                  }
               });
            });
         });
      });
   };
})(window.mapeaSuite.maxExtent || {});