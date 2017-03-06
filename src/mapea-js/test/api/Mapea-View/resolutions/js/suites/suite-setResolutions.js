(function (suiteModule) {
   suiteModule.setResolutions = function () {
      suite('Método setResolutions', function () {

         test('setResolutions con array de numeros', function () {
            map.setResolutions(RESOLUTIONS_ARR_NUMBER);

            assert.deepEqual(map.getResolutions(), RESOLUTIONS_ARR_NUMBER, 'Las resoluciones del mapa coinciden con las especificadas');
         });
         test('setResolutions con string separados por (,)', function () {
            map.setResolutions(RESOLUTIONS_STRING_COMA);

            assert.deepEqual(map.getResolutions(), RESOLUTIONS_ARR_NUMBER, 'Las resoluciones del mapa coinciden con las especificadas');
         });
         test('setResolutions con string separados por (;)', function () {
            map.setResolutions(RESOLUTIONS_STRING_PUNTOYCOMA);

            assert.deepEqual(map.getResolutions(), RESOLUTIONS_ARR_NUMBER, 'Las resoluciones del mapa coinciden con las especificadas');
         });
         test('setResolutions con array de string', function () {
            map.setResolutions(RESOLUTIONS_ARR_STRING);

            assert.deepEqual(map.getResolutions(), RESOLUTIONS_ARR_NUMBER, 'Las resoluciones del mapa coinciden con las especificadas');
         });
         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.setResolutions();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.setResolutions(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.setResolutions([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.setResolutions([null, null, null, null]);
            });
         });
         test('Falla porque especifico un parámetro objeto', function () {
            assert.throw(function () {
               map.setResolutions({});
            });
         });
         test('Falla porque especifico un parámetro string vacío', function () {
            assert.throw(function () {
               map.setResolutions('');
            });
         });
         test('Falla porque especifico un array de cadenas', function () {
            assert.throw(function () {
               map.setResolutions(['3x917476.4415233', '60109x.617681153', '43613s62.3476771', 'ah']);
            });
         });
         test('Falla porque especifico un string con coordenadas con separador invalido', function () {
            assert.throw(function () {
               map.setResolutions('3917476.4415233*60109.617681153*4361362.3476771*650113.72970273');
            });
         });
      });
   };
})(window.mapeaSuite.resolutions || {});