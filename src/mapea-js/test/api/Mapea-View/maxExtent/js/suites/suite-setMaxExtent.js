(function (suiteModule) {
   suiteModule.setMaxExtent = function () {
      suite('Método setMaxExtent', function () {

         test('setMaxExtent con array de numeros', function () {
            map.setMaxExtent(EXTENT_ARRAY);

            var maxExtent = map.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('setMaxExtent con array de string', function () {
            map.setMaxExtent(EXTENT_ARRAY_STRING);

            var maxExtent = map.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('setMaxExtent con string separados por (,)', function () {
            map.setMaxExtent(EXTENT_STRING_COMA);

            var maxExtent = map.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('setMaxExtent con string separados por (;)', function () {
            map.setMaxExtent(EXTENT_STRING_PUNTOYCOMA);

            var maxExtent = map.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('setMaxExtent con objeto {left, bottom, right, top}', function () {
            map.setMaxExtent(EXTENT_OBJETO);

            var maxExtent = map.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('setMaxExtent con objeto {x, y}', function () {
            map.setMaxExtent(GET_MAX_EXTENT);

            var maxExtent = map.getMaxExtent();
            assert.deepEqual(maxExtent, GET_MAX_EXTENT, 'el maxExtent especificado es el esperado');
         });
         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.setMaxExtent();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.setMaxExtent(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.setMaxExtent([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.setMaxExtent([null, null, null, null]);
            });
         });
         test('Falla porque especifico un parámetro objeto vacío', function () {
            assert.throw(function () {
               map.setMaxExtent({});
            });
         });
         test('Falla porque especifico un parámetro string vacío', function () {
            assert.throw(function () {
               map.setMaxExtent('');
            });
         });
         test('Falla porque especifico un array con 3 coordenadas', function () {
            assert.throw(function () {
               map.setMaxExtent([3917476.4415233, 60109.617681153, 4361362.3476771]);
            });
         });
         test('Falla porque especifico un array de cadenas', function () {
            assert.throw(function () {
               map.setMaxExtent(['3x917476.4415233', '60109x.617681153', '43613s62.3476771', 'ah']);
            });
         });
         test('Falla porque especifico un string con 3 coordenadas', function () {
            assert.throw(function () {
               map.setMaxExtent('3917476.4415233,60109.617681153,4361362.3476771');
            });
         });
         test('Falla porque especifico un string con coordenadas con separador invalido', function () {
            assert.throw(function () {
               map.setMaxExtent('3917476.4415233*60109.617681153*4361362.3476771*650113.72970273');
            });
         });
         test('Falla porque especifico un objeto con nulos (1)', function () {
            assert.throw(function () {
               map.setMaxExtent({
                  left: null,
                  bottom: null,
                  right: null,
                  top: null
               });
            });
         });
         test('Falla porque especifico un objeto con nulos (2)', function () {
            assert.throw(function () {
               map.setMaxExtent({
                  x: {
                     min: null,
                     max: null
                  },
                  y: {
                     min: null,
                     max: null
                  }
               });
            });
         });
         test('Falla porque especifico un objeto con propiedades erroneas', function () {
            assert.throw(function () {
               map.setMaxExtent({
                  xmin: 60109.617681153,
                  ymin: 3917476.4415233,
                  xmax: 650113.72970273,
                  ymax: 4361362.3476771
               });
            });
         });
      });
   };
})(window.mapeaSuite.maxExtent || {});