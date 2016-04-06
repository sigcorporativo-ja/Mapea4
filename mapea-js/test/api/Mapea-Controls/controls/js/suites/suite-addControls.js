(function (suiteModule) {
   suiteModule.addControls = function () {

      suite('Método addControls', function () {
         var control1, control1Obj, control2, control2Obj,
            numControls;

         setup(function () {
            control1 = SCALE_LINE;
            control1Obj = new M.control.Default(SCALE_LINE);

            control2 = MOUSE;
            control2Obj = new M.control.Default(MOUSE);

            numControls = map.getControls().length;
         });

         test('Añadimos un control', function () {
            map.addControls(control1);

            assert.isAbove(map.getControls().length, numControls, 'El número de controles ha aumentado');
            assert.isTrue(map.getControls().includes(control1Obj));
         });
         test('Añadimos dos veces el mismo control', function () {
            map.addControls([control1]);
            var numControlsAdded = map.getControls().length;
            map.addControls(control1Obj);
            var numControlsAdded2 = map.getControls().length;

            assert.isAbove(map.getControls().length, numControls, 'El número de controles ha aumentado');
            assert.isAbove(numControlsAdded, numControls, 'El número de controles ha aumentado');
            assert.strictEqual(numControlsAdded2, numControlsAdded, 'El número de controles no ha aumentado al añadir los mismos');
            assert.isTrue(map.getControls().includes(control1Obj));
         });
         test('Añadimos dos controles distintos de una vez', function () {
            map.addControls([control1, control2Obj]);

            assert.isTrue(map.getControls().includes(control1Obj));
            assert.isTrue(map.getControls().includes(control2Obj));
            assert.strictEqual(map.getControls().length, (numControls + 2), 'El número de controles no ha aumentado en 2 al añadir dos controles');
         });
         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.addControls();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.addControls(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.addControls([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.addControls([null, null]);
            });
         });
         test('Falla porque intento añadir un control desconocido (1)', function () {
            assert.throw(function () {
               map.addControls('controlInexistente');
            });
         });
      });
   };
})(window.mapeaSuite.controls || {});