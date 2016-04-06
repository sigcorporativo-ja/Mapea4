(function (suiteModule) {
   suiteModule.getControls = function () {
      suite('Método getControls', function () {
         var control1, control2, control3;

         setup(function () {
            control1 = new M.control.Default(SCALE_LINE);
            map.addControls(control1);

            control2 = new M.control.Default(MOUSE);
            map.addControls(control2);

            control3 = new M.control.Default(OVERVIEWMAP);
            map.addControls(control3);
         });

         test('Obtenemos el control a partir del nombre (1/3)', function () {
            var foundControls = map.getControls(control1.name);
            assert.instanceOf(foundControls[0], M.Control);
            assert.instanceOf(foundControls[0], M.control.Default);
            assert.isTrue(foundControls.includes(control1));
            assert.isFalse(foundControls.includes(control2));
            assert.isFalse(foundControls.includes(control3));

            assert.strictEqual(foundControls.length, 1, 'sólo un control coincide con el criterio de búsqueda');
         });
         test('Obtenemos dos controles a partir de sus nombres (2/3)', function () {
            var foundControls = map.getControls([control1.name, control2.name]);
            assert.instanceOf(foundControls[0], M.Control);
            assert.instanceOf(foundControls[0], M.control.Default);
            assert.isTrue(foundControls.includes(control1));
            assert.instanceOf(foundControls[1], M.Control);
            assert.instanceOf(foundControls[1], M.control.Default);
            assert.isTrue(foundControls.includes(control2));
            assert.isFalse(foundControls.includes(control3));

            assert.strictEqual(foundControls.length, 2, 'sólo dos controles coinciden con el criterio de búsqueda');
         });
         test('Obtenemos todos los controles (3/3)', function () {
            var foundControls = map.getControls();

            assert.isTrue(foundControls.includes(control1));
            assert.isTrue(foundControls.includes(control2));
            assert.isTrue(foundControls.includes(control3));
            assert.strictEqual(foundControls.length, 4, 'Todos los controles son devueltos');
         });
         test('No obtenemos ningún control al especificar un nombre inexistente (0/3)', function () {
            var foundControls = map.getControls('controlInexistente');

            assert.strictEqual(foundControls.length, 0, 'ningún control coincide con el criterio de búsqueda');
         });
      });
   };
})(window.mapeaSuite.controls || {});