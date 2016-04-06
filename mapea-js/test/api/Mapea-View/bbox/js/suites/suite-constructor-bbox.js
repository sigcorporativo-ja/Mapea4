(function (suiteModule) {
   suiteModule.constructorBbox = function () {
      suite('Constructor con parámetro \'bbox\'', function () {

         test('Constructor a partir de bbox con array de numeros', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               bbox: BBOX_ARRAY
            });

            var bbox = mapa.getBbox();
         });
         test('Constructor a partir de bbox con array de string', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               bbox: BBOX_ARRAY_STRING
            });

            var bbox = mapa.getBbox();
         });
         test('Constructor a partir de bbox con string separados por (,)', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               bbox: BBOX_STRING_COMA
            });

            var bbox = mapa.getBbox();
         });
         test('Constructor a partir de bbox con string separados por (;)', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               bbox: BBOX_STRING_PUNTOYCOMA
            });

            var bbox = mapa.getBbox();
         });
         test('Constructor a partir de bbox con objeto {left, bottom, right, top}', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               bbox: BBOX_OBJETO
            });

            var bbox = mapa.getBbox();
         });
         test('Constructor a partir de bbox con objeto {x, y}', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               bbox: GET_BBOX
            });

            var bbox = mapa.getBbox();
         });
         test('Falla porque especifico un parámetro objeto vacío', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  bbox: {}
               });
            });
         });
         test('Falla porque especifico un array con 3 coordenadas', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  bbox: [3917476.4415233, 60109.617681153, 4361362.3476771]
               });
            });
         });
         test('Falla porque especifico un array de cadenas', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  bbox: ['3x917476.4415233', '60109x.617681153', '43613s62.3476771', 'ah']
               });
            });
         });
         test('Falla porque especifico un string con 3 coordenadas', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  bbox: '3917476.4415233,60109.617681153,4361362.3476771'
               });
            });
         });
         test('Falla porque especifico un string con coordenadas con separador invalido', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  bbox: '3917476.4415233*60109.617681153*4361362.3476771*650113.72970273'
               });
            });
         });
         test('Falla porque especifico un objeto con nulos (1)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  bbox: {
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
                  bbox: {
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
                  bbox: {
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
})(window.mapeaSuite.bbox || {});