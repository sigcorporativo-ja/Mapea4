(function (suiteModule) {
   suiteModule.constructorResolutions = function () {
      suite('Constructor con parámetro \'resolutions\'', function () {

         test('Constructor a partir de resolutions con array de numeros', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               resolutions: RESOLUTIONS_ARR_NUMBER
            });

            assert.deepEqual(mapa.getResolutions(), RESOLUTIONS_ARR_NUMBER, 'Las resoluciones del mapa coinciden con las especificadas');
         });
         test('Constructor a partir de resolutions con string separados por (,)', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               resolutions: RESOLUTIONS_STRING_COMA
            });

            assert.deepEqual(mapa.getResolutions(), RESOLUTIONS_ARR_NUMBER, 'Las resoluciones del mapa coinciden con las especificadas');
         });
         test('Constructor a partir de resolutions con string separados por (;)', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               resolutions: RESOLUTIONS_STRING_PUNTOYCOMA
            });

            assert.deepEqual(mapa.getResolutions(), RESOLUTIONS_ARR_NUMBER, 'Las resoluciones del mapa coinciden con las especificadas');
         });
         test('Constructor a partir de resolutions con array de string', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               resolutions: RESOLUTIONS_ARR_STRING
            });

            assert.deepEqual(mapa.getResolutions(), RESOLUTIONS_ARR_NUMBER, 'Las resoluciones del mapa coinciden con las especificadas');
         });
         test('Falla porque especifico un parámetro objeto', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  resolutions: {}
               });
            });
         });
         test('Falla porque especifico un array de cadenas', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  resolutions: ['3x917476.4415233', '60109x.617681153', '43613s62.3476771', 'ah']
               });
            });
         });
         test('Falla porque especifico un string con coordenadas con separador invalido', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  resolutions: '3917476.4415233*60109.617681153*4361362.3476771*650113.72970273'
               });
            });
         });
      });
   };
})(window.mapeaSuite.resolutions || {});