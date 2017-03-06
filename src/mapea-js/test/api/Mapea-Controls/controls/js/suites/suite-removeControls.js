(function (suiteModule) {
   suiteModule.removeControls = function () {
      suite('Método removeControls', function () {
         var control1, control2, control3, control4, numControls;

         setup(function () {
            control1 = new M.control.Default(SCALE_LINE);
            control2 = new M.control.Default(MOUSE);
            control3 = new M.control.Default(OVERVIEWMAP);
            control4 = new M.control.Default(PANZOOMBAR);
            map.addControls(control1).addControls([control2, control3]);

            numControls = map.getControls().length;
         });

         test('Eliminamos el control a partir del nombre (1/3)', function () {
            map.removeControls(control1.name);

            assert.isBelow(map.getControls().length, numControls, 'El número de controles ha disminuido');

            assert.isFalse(map.getControls().includes(control1));
            assert.isTrue(map.getControls().includes(control2));
            assert.isTrue(map.getControls().includes(control3));
         });
         test('Eliminamos el control a partir del mismo (1/3)', function () {
            map.removeControls(control1);

            assert.isBelow(map.getControls().length, numControls, 'El número de controles ha disminuido');

            assert.isFalse(map.getControls().includes(control1));
            assert.isTrue(map.getControls().includes(control2));
            assert.isTrue(map.getControls().includes(control3));
         });
         test('Eliminamos dos controles a partir de sus nombres (2/3)', function () {
            map.removeControls([control1.name, control2.name]);

            assert.isBelow(map.getControls().length, numControls, 'El número de controles ha disminuido');

            assert.isFalse(map.getControls().includes(control1));
            assert.isFalse(map.getControls().includes(control2));
            assert.isTrue(map.getControls().includes(control3));
         });
         test('Eliminamos dos controles a partir de ellos (2/3)', function () {
            map.removeControls([control1, control2]);

            assert.isBelow(map.getControls().length, numControls, 'El número de controles ha disminuido');

            assert.isFalse(map.getControls().includes(control1));
            assert.isFalse(map.getControls().includes(control2));
            assert.isTrue(map.getControls().includes(control3));
         });
         test('Eliminamos todos los controles añadidos previamente (3/3)', function () {
            map.removeControls([control1.name, control2.name, control3.name]);

            assert.isBelow(map.getControls().length, numControls, 'El número de controles ha disminuido');

            assert.isFalse(map.getControls().includes(control1));
            assert.isFalse(map.getControls().includes(control2));
            assert.isFalse(map.getControls().includes(control3));
            assert.strictEqual(map.getControls().length, 1, 'Todos los controles son eliminados');
         });
         test('Eliminamos todos los controles añadidos previamente a través de sus instancias (3/3)', function () {
            map.removeControls([control1, control2, control3]);

            assert.isBelow(map.getControls().length, numControls, 'El número de controles ha disminuido');

            assert.isFalse(map.getControls().includes(control1));
            assert.isFalse(map.getControls().includes(control2));
            assert.isFalse(map.getControls().includes(control3));
            assert.strictEqual(map.getControls().length, 1, 'Todos los controles son eliminados');
         });
         test('Eliminamos todos los controles (4/3)', function () {
            map.removeControls(map.getControls());

            assert.isFalse(map.getControls().includes(control1));
            assert.isFalse(map.getControls().includes(control2));
            assert.isFalse(map.getControls().includes(control3));
            assert.strictEqual(map.getControls().length, 0, 'Todos los controles son eliminados');
         });
         test('Eliminamos un control que no está (0/3)', function () {
            map.removeControls(control4);

            assert.strictEqual(map.getControls().length, numControls, 'El número de controles no ha cambiado');

            assert.isTrue(map.getControls().includes(control1));
            assert.isTrue(map.getControls().includes(control2));
            assert.isTrue(map.getControls().includes(control3));
         });
         test('Falla porque no especifico parámetros', function () {
            assert.throw(function () {
               map.removeControls();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               map.removeControls(null);
            });
         });
         test('Falla porque especifico un parámetro array vacío', function () {
            assert.throw(function () {
               map.removeControls([]);
            });
         });
         test('Falla porque especifico un parámetro array de nulos', function () {
            assert.throw(function () {
               map.removeControls([null, null]);
            });
         });
      });
   };
})(window.mapeaSuite.controls || {});