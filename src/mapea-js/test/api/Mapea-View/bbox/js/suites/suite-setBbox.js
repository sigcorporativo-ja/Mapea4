(function (suiteModule) {
   suiteModule.setBbox = function () {
      suite('Método setBbox', function () {

         test('setBbox con array de numeros', function () {
            map.setBbox(BBOX_ARRAY);

            var bbox = map.getBbox();
         });
         test('setBbox con array de string', function () {
            map.setBbox(BBOX_ARRAY_STRING);

            var bbox = map.getBbox();
         });
         test('setBbox con string separados por (,)', function () {
            map.setBbox(BBOX_STRING_COMA);

            var bbox = map.getBbox();
         });
         test('setBbox con string separados por (;)', function () {
            map.setBbox(BBOX_STRING_PUNTOYCOMA);

            var bbox = map.getBbox();
         });
         test('setBbox con objeto {left, bottom, right, top}', function () {
            map.setBbox(BBOX_OBJETO);

            var bbox = map.getBbox();
         });
         test('setBbox con objeto {x, y}', function () {
            map.setBbox(GET_BBOX);

            var bbox = map.getBbox();
         });
         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.setBbox();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.setBbox(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.setBbox([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.setBbox([null, null, null, null]);
            });
         });
         test('Falla porque especifico un parámetro objeto vacío', function () {
            assert.throw(function () {
               map.setBbox({});
            });
         });
         test('Falla porque especifico un parámetro string vacío', function () {
            assert.throw(function () {
               map.setBbox('');
            });
         });
         test('Falla porque especifico un array con 3 coordenadas', function () {
            assert.throw(function () {
               map.setBbox([3917476.4415233, 60109.617681153, 4361362.3476771]);
            });
         });
         test('Falla porque especifico un array de cadenas', function () {
            assert.throw(function () {
               map.setBbox(['3x917476.4415233', '60109x.617681153', '43613s62.3476771', 'ah']);
            });
         });
         test('Falla porque especifico un string con 3 coordenadas', function () {
            assert.throw(function () {
               map.setBbox('3917476.4415233,60109.617681153,4361362.3476771');
            });
         });
         test('Falla porque especifico un string con coordenadas con separador invalido', function () {
            assert.throw(function () {
               map.setBbox('3917476.4415233*60109.617681153*4361362.3476771*650113.72970273');
            });
         });
         test('Falla porque especifico un objeto con nulos (1)', function () {
            assert.throw(function () {
               map.setBbox({
                  left: null,
                  bottom: null,
                  right: null,
                  top: null
               });
            });
         });
         test('Falla porque especifico un objeto con nulos (2)', function () {
            assert.throw(function () {
               map.setBbox({
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
               map.setBbox({
                  xmin: 60109.617681153,
                  ymin: 3917476.4415233,
                  xmax: 650113.72970273,
                  ymax: 4361362.3476771
               });
            });
         });
      });
   };
})(window.mapeaSuite.bbox || {});