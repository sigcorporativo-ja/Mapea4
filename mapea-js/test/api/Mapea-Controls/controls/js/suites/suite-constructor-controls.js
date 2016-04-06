(function (suiteModule) {
   suiteModule.constructorControls = function () {
      suite('Constructor con parámetro \'controls\'', function () {
         var control1, control1Obj, control2, control2Obj;

         setup(function () {
            control1 = SCALE_LINE;
            control1Obj = new M.control.Default(SCALE_LINE);

            control2 = MOUSE;
            control2Obj = new M.control.Default(MOUSE);
         });

         test('Constructor a partir de un control creado (1)', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               controls: control1Obj
            });

            assert.strictEqual(mapa.getControls().length, 1, 'El número de controles es 1 exactamente');
            assert.isTrue(mapa.getControls().includes(control1Obj));
            assert.isFalse(mapa.getControls().includes(control2Obj));
         });
         test('Constructor a partir de un control creado (2)', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               controls: control1
            });

            assert.strictEqual(mapa.getControls().length, 1, 'El número de controles es 1 exactamente');
            assert.isTrue(mapa.getControls().includes(control1Obj));
            assert.isFalse(mapa.getControls().includes(control2Obj));
         });
         test('Constructor a partir de un control y luego intentamos añadir el mismo', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               controls: control1Obj
            }).addControls(control1);

            assert.strictEqual(mapa.getControls().length, 1, 'El número de controles es 1 exactamente');
            assert.isTrue(mapa.getControls().includes(control1Obj));
            assert.isFalse(mapa.getControls().includes(control2Obj));
         });
         test('Constructor con dos controles distintos de una vez', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               controls: [control1Obj, control2]
            });

            assert.strictEqual(mapa.getControls().length, 2, 'El número de controles es 2 exactamente');
            assert.isTrue(mapa.getControls().includes(control1Obj));
            assert.isTrue(mapa.getControls().includes(control2Obj));
         });
         test('Constructor a partir de un control y luego añadimos otro distinto', function () {
            var mapa = M.map({
               container: 'constructor-tests',
               controls: [control1Obj]
            }).addControls(control2);

            assert.strictEqual(mapa.getControls().length, 2, 'El número de controles es 2 exactamente');
            assert.isTrue(mapa.getControls().includes(control1Obj));
            assert.isTrue(mapa.getControls().includes(control2Obj));
         });

         test('Falla porque intento añadir un control desconocido (1)', function () {
            assert.throw(function () {
               var mapa = M.map({
                  container: 'constructor-tests',
                  controls: 'controlInexistente'
               });
            });
         });
      });
   };
})(window.mapeaSuite.controls || {});