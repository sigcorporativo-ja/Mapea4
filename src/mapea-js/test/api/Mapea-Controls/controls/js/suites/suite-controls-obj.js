(function (suiteModule) {
   suiteModule.object = function () {
      suite('Objeto con M.Control', function () {
         // formato v3
         test('Control (1.1): \'scale\'', function () {
            var control = new M.control.Default(SCALE);
            assert.equal(control.name, SCALE, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (1.2): \'sCAle\'', function () {
            var control = new M.control.Default('sCAle');
            assert.equal(control.name, SCALE, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (2.1): \'scaleline\'', function () {
            var control = new M.control.Default(SCALE_LINE);
            assert.equal(control.name, SCALE_LINE, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (2.2): \'scaLELIne\'', function () {
            var control = new M.control.Default('scaLELIne');
            assert.equal(control.name, SCALE_LINE, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (3.1): \'panzoombar\'', function () {
            var control = new M.control.Default(PANZOOMBAR);
            assert.equal(control.name, PANZOOMBAR, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (3.2): \'PANZOOMBAR\'', function () {
            var control = new M.control.Default('PANZOOMBAR');
            assert.equal(control.name, PANZOOMBAR, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (4.1): \'panzoom\'', function () {
            var control = new M.control.Default(PANZOOM);
            assert.equal(control.name, PANZOOM, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (4.2): \'panZoom\'', function () {
            var control = new M.control.Default('panZoom');
            assert.equal(control.name, PANZOOM, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (5.1): \'layerswitcher\'', function () {
            var control = new M.control.Default(LAYERSWITCHER);
            assert.equal(control.name, LAYERSWITCHER, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (5.2): \'layerSWITCHer\'', function () {
            var control = new M.control.Default('layerSWITCHer');
            assert.equal(control.name, LAYERSWITCHER, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (6.1): \'mouse\'', function () {
            var control = new M.control.Default(MOUSE);
            assert.equal(control.name, MOUSE, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (6.2): \'mousE\'', function () {
            var control = new M.control.Default('mousE');
            assert.equal(control.name, MOUSE, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (7.1): \'navtoolbar\'', function () {
            var control = new M.control.Default(NAVTOOLBAR);
            assert.equal(control.name, NAVTOOLBAR, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (7.2): \'navTOOLbar\'', function () {
            var control = new M.control.Default('navTOOLbar');
            assert.equal(control.name, NAVTOOLBAR, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (8.1): \'overviewmap\'', function () {
            var control = new M.control.Default(OVERVIEWMAP);
            assert.equal(control.name, OVERVIEWMAP, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (8.2): \'overViewMap\'', function () {
            var control = new M.control.Default('overViewMap');
            assert.equal(control.name, OVERVIEWMAP, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (9.1): \'measurebar\'', function () {
            var control = new M.control.Default(MEASUREBAR);
            assert.equal(control.name, MEASUREBAR, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (9.2): \'measureBar\'', function () {
            var control = new M.control.Default('measureBar');
            assert.equal(control.name, MEASUREBAR, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (10.1): \'location\'', function () {
            var control = new M.control.Default(LOCATION);
            assert.equal(control.name, LOCATION, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Control (10.2): \'Location\'', function () {
            var control = new M.control.Default('Location');
            assert.equal(control.name, LOCATION, 'el control creado posee el mismo nombre que el especificado');
         });
         test('Falla porque no especifico ningún parámetro', function () {
            assert.throw(function () {
               var control = new M.control.Default();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               var layer = new M.control.Default(null);
            });
         });
         test('Falla porque especifico un objeto vacío', function () {
            assert.throw(function () {
               var layer = new M.control.Default({});
            });
         });
         test('Falla porque el control no existe', function () {
            assert.throw(function () {
               var layer = new M.control.Default('controlInexistente');
            });
         });
      });
   };
})(window.mapeaSuite.controls || {});