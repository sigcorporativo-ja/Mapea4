(function (suiteModule) {
   suiteModule.object = function () {
      suite('Objeto con M.layer.WFS', function () {
         // formato v3 - POINT
         test('Formato v3 (1.1) - Point: \'WFST*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(WFST.concat('*').concat(TITLE_POINT)
               .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
               .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, [FEATURE_ID1_POINT, FEATURE_ID2_POINT]);
         });
         test('Formato v3 (1.2) - Point: \'wfST*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(wfST.concat('*').concat(TITLE_POINT)
               .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
               .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, [FEATURE_ID1_POINT, FEATURE_ID2_POINT]);
         });
         test('Formato v3 (2.1) - Point: \'WFST*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(WFST.concat('*').concat(TITLE_POINT)
               .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT);
         });
         test('Formato v3 (2.2) - Point: \'wfST*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(wfST.concat('*').concat(TITLE_POINT)
               .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT);
         });
         // formato v3 - LINE
         test('Formato v3 (1.1) - Line: \'WFST*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(WFST.concat('*').concat(TITLE_LINE)
               .concat('*').concat(URL_LINE).concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(GEOM_LINE)
               .concat('*').concat(FEATURE_ID1_LINE).concat('-').concat(FEATURE_ID2_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, [FEATURE_ID1_LINE, FEATURE_ID2_LINE]);
         });
         test('Formato v3 (1.2) - Line: \'wfST*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(wfST.concat('*').concat(TITLE_LINE)
               .concat('*').concat(URL_LINE).concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(GEOM_LINE)
               .concat('*').concat(FEATURE_ID1_LINE).concat('-').concat(FEATURE_ID2_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, [FEATURE_ID1_LINE, FEATURE_ID2_LINE]);
         });
         test('Formato v3 (2.1) - Line: \'WFST*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(WFST.concat('*').concat(TITLE_LINE)
               .concat('*').concat(URL_LINE).concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(GEOM_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE);
         });
         test('Formato v3 (2.2) - Line: \'wfST*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(wfST.concat('*').concat(TITLE_LINE)
               .concat('*').concat(URL_LINE).concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(GEOM_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE);
         });
         // formato v3 - POLYGON
         test('Formato v3 (1.1) - Polygon: \'WFST*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(WFST.concat('*').concat(TITLE_POL)
               .concat('*').concat(URL_POL).concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(GEOM_POL)
               .concat('*').concat(FEATURE_ID1_POL).concat('-').concat(FEATURE_ID2_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, [FEATURE_ID1_POL, FEATURE_ID2_POL]);
         });
         test('Formato v3 (1.2) - Polygon: \'wfST*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(wfST.concat('*').concat(TITLE_POL)
               .concat('*').concat(URL_POL).concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(GEOM_POL)
               .concat('*').concat(FEATURE_ID1_POL).concat('-').concat(FEATURE_ID2_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, [FEATURE_ID1_POL, FEATURE_ID2_POL]);
         });
         test('Formato v3 (2.1) - Polygon: \'WFST*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(WFST.concat('*').concat(TITLE_POL)
               .concat('*').concat(URL_POL).concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(GEOM_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL);
         });
         test('Formato v3 (2.2) - Polygon: \'wfST*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(wfST.concat('*').concat(TITLE_POL)
               .concat('*').concat(URL_POL).concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(GEOM_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL);
         });

         // formato v4 - Point
         test('Formato v4 (1.1) - Point: \'WFS*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(WFS.concat('*').concat(TITLE_POINT)
               .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
               .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, [FEATURE_ID1_POINT, FEATURE_ID2_POINT]);
         });
         test('Formato v4 (1.2) - Point: \'wfS*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(wfS.concat('*').concat(TITLE_POINT)
               .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
               .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, [FEATURE_ID1_POINT, FEATURE_ID2_POINT]);
         });
         test('Formato v4 (2.1) - Point: \'WFS*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(WFS.concat('*').concat(TITLE_POINT)
               .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT);
         });
         test('Formato v4 (2.2) - Point: \'wfS*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(wfS.concat('*').concat(TITLE_POINT)
               .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT);
         });
         test('Formato v4 (3) - Point: \'URL*NAMESPACE:NAME*TITLE*CQL*VERSION\'', function () {
            var layer = new M.layer.WFS(URL_POINT.concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(TITLE_POINT)
               .concat('*').concat(CQL_POINT).concat('*').concat(VERSION_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, null, CQL_POINT, VERSION_POINT);
         });
         test('Formato v4 (4) - Point: \'URL*NAMESPACE:NAME*TITLE*CQL\'', function () {
            var layer = new M.layer.WFS(URL_POINT.concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(TITLE_POINT)
               .concat('*').concat(CQL_POINT).concat('*').concat(VERSION_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, null, CQL_POINT);
         });
         test('Formato v4 (5) - Point: \'URL*NAMESPACE:NAME*TITLE\'', function () {
            var layer = new M.layer.WFS(URL_POINT.concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT).concat('*').concat(TITLE_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT);
         });
         test('Formato v4 (6) - Point: \'URL*NAMESPACE:NAME\'', function () {
            var layer = new M.layer.WFS(URL_POINT.concat('*').concat(NAMESPACE_POINT)
               .concat(':').concat(NAME_POINT));

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT);
         });
         // formato v4 - LINE
         test('Formato v4 (1.1) - Line: \'WFS*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(WFS.concat('*').concat(TITLE_LINE)
               .concat('*').concat(URL_LINE).concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(GEOM_LINE)
               .concat('*').concat(FEATURE_ID1_LINE).concat('-').concat(FEATURE_ID2_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, [FEATURE_ID1_LINE, FEATURE_ID2_LINE]);
         });
         test('Formato v4 (1.2) - Line: \'wfS*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(wfS.concat('*').concat(TITLE_LINE)
               .concat('*').concat(URL_LINE).concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(GEOM_LINE)
               .concat('*').concat(FEATURE_ID1_LINE).concat('-').concat(FEATURE_ID2_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, [FEATURE_ID1_LINE, FEATURE_ID2_LINE]);
         });
         test('Formato v4 (2.1) - Line: \'WFS*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(WFS.concat('*').concat(TITLE_LINE)
               .concat('*').concat(URL_LINE).concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(GEOM_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE);
         });
         test('Formato v4 (2.2) - Line: \'wfS*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(wfS.concat('*').concat(TITLE_LINE)
               .concat('*').concat(URL_LINE).concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(GEOM_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE);
         });
         test('Formato v4 (3) - Line: \'URL*NAMESPACE:NAME*TITLE*CQL*VERSION\'', function () {
            var layer = new M.layer.WFS(URL_LINE.concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(TITLE_LINE)
               .concat('*').concat(CQL_LINE).concat('*').concat(VERSION_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, null, CQL_LINE, VERSION_LINE);
         });
         test('Formato v4 (4) - Line: \'URL*NAMESPACE:NAME*TITLE*CQL\'', function () {
            var layer = new M.layer.WFS(URL_LINE.concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(TITLE_LINE)
               .concat('*').concat(CQL_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, null, CQL_LINE);
         });
         test('Formato v4 (5) - Line: \'URL*NAMESPACE:NAME*TITLE\'', function () {
            var layer = new M.layer.WFS(URL_LINE.concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE).concat('*').concat(TITLE_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE);
         });
         test('Formato v4 (6) - Line: \'URL*NAMESPACE:NAME\'', function () {
            var layer = new M.layer.WFS(URL_LINE.concat('*').concat(NAMESPACE_LINE)
               .concat(':').concat(NAME_LINE));

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE);
         });
         // formato v4 - POLYGON
         test('Formato v4 (1.1) - Polygon: \'WFS*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(WFS.concat('*').concat(TITLE_POL)
               .concat('*').concat(URL_POL).concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(GEOM_POL)
               .concat('*').concat(FEATURE_ID1_POL).concat('-').concat(FEATURE_ID2_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, [FEATURE_ID1_POL, FEATURE_ID2_POL]);
         });
         test('Formato v4 (1.2) - Polygon: \'wfS*TITLE*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2\'', function () {
            var layer = new M.layer.WFS(wfS.concat('*').concat(TITLE_POL)
               .concat('*').concat(URL_POL).concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(GEOM_POL)
               .concat('*').concat(FEATURE_ID1_POL).concat('-').concat(FEATURE_ID2_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, [FEATURE_ID1_POL, FEATURE_ID2_POL]);
         });
         test('Formato v4 (2.1) - Polygon: \'WFS*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(WFS.concat('*').concat(TITLE_POL)
               .concat('*').concat(URL_POL).concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(GEOM_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL);
         });
         test('Formato v4 (2.2) - Polygon: \'wfS*TITLE*URL*NAMESPACE:NAME*GEOM\'', function () {
            var layer = new M.layer.WFS(wfS.concat('*').concat(TITLE_POL)
               .concat('*').concat(URL_POL).concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(GEOM_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL);
         });
         test('Formato v4 (3) - Polygon: \'URL*NAMESPACE:NAME*TITLE*CQL*VERSION\'', function () {
            var layer = new M.layer.WFS(URL_POL.concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(TITLE_POL)
               .concat('*').concat(CQL_POL).concat('*').concat(VERSION_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, null, CQL_POL, VERSION_POL);
         });
         test('Formato v4 (4) - Polygon: \'URL*NAMESPACE:NAME*TITLE*CQL\'', function () {
            var layer = new M.layer.WFS(URL_POL.concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(TITLE_POL)
               .concat('*').concat(CQL_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, null, CQL_POL);
         });
         test('Formato v4 (5) - Polygon: \'URL*NAMESPACE:NAME*TITLE\'', function () {
            var layer = new M.layer.WFS(URL_POL.concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL).concat('*').concat(TITLE_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL);
         });
         test('Formato v4 (6) - Polygon: \'URL*NAMESPACE:NAME\'', function () {
            var layer = new M.layer.WFS(URL_POL.concat('*').concat(NAMESPACE_POL)
               .concat(':').concat(NAME_POL));

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL);
         });

         // Objeto
         // Objecto - Point
         test('Objeto (1.1) - Point: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT,
               cql: CQL_POINT,
               geometry: GEOM_POINT,
               ids: [FEATURE_ID1_POINT, FEATURE_ID2_POINT],
               version: VERSION_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, null, CQL_POINT, VERSION_POINT);
         });
         test('Objeto (1.2) - Point: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: WFST,
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT,
               cql: CQL_POINT,
               geometry: GEOM_POINT,
               ids: [FEATURE_ID1_POINT, FEATURE_ID2_POINT],
               version: VERSION_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, null, CQL_POINT, VERSION_POINT);
         });
         test('Objeto (1.3) - Point: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: wfST,
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT,
               cql: CQL_POINT,
               geometry: GEOM_POINT,
               ids: [FEATURE_ID1_POINT, FEATURE_ID2_POINT],
               version: VERSION_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, null, CQL_POINT, VERSION_POINT);
         });
         test('Objeto (1.4) - Point: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: WFS,
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT,
               cql: CQL_POINT,
               geometry: GEOM_POINT,
               ids: [FEATURE_ID1_POINT, FEATURE_ID2_POINT],
               version: VERSION_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, null, CQL_POINT, VERSION_POINT);
         });
         test('Objeto (1.5) - Point: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: wfS,
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT,
               cql: CQL_POINT,
               geometry: GEOM_POINT,
               ids: [FEATURE_ID1_POINT, FEATURE_ID2_POINT],
               version: VERSION_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, null, CQL_POINT, VERSION_POINT);
         });
         test('Objeto (2) - Point: url, namespace, name, legend, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT,
               geometry: GEOM_POINT,
               ids: [FEATURE_ID1_POINT, FEATURE_ID2_POINT],
               version: VERSION_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, [FEATURE_ID1_POINT, FEATURE_ID2_POINT], null, VERSION_POINT);
         });
         test('Objeto (3) - Point: url, namespace, name, legend, geom, ids', function () {
            var layer = new M.layer.WFS({
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT,
               geometry: GEOM_POINT,
               ids: [FEATURE_ID1_POINT, FEATURE_ID2_POINT]
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT, [FEATURE_ID1_POINT, FEATURE_ID2_POINT]);
         });
         test('Objeto (4) - Point: url, namespace, name, legend, geom', function () {
            var layer = new M.layer.WFS({
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT,
               geometry: GEOM_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               GEOM_POINT, TITLE_POINT);
         });
         test('Objeto (5) - Point: url, namespace, name, legend', function () {
            var layer = new M.layer.WFS({
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT,
               legend: TITLE_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT,
               null, TITLE_POINT);
         });
         test('Objeto (6) - Point: url, namespace, name', function () {
            var layer = new M.layer.WFS({
               url: URL_POINT,
               namespace: NAMESPACE_POINT,
               name: NAME_POINT
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POINT, NAMESPACE_POINT, NAME_POINT);
         });
         // Objecto - Line
         test('Objeto (1.1) - Line: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE,
               cql: CQL_LINE,
               geometry: GEOM_LINE,
               ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
               version: VERSION_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, null, CQL_LINE, VERSION_LINE);
         });
         test('Objeto (1.2) - Line: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: WFST,
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE,
               cql: CQL_LINE,
               geometry: GEOM_LINE,
               ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
               version: VERSION_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, null, CQL_LINE, VERSION_LINE);
         });
         test('Objeto (1.3) - Line: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: wfST,
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE,
               cql: CQL_LINE,
               geometry: GEOM_LINE,
               ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
               version: VERSION_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, null, CQL_LINE, VERSION_LINE);
         });
         test('Objeto (1.4) - Line: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: WFS,
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE,
               cql: CQL_LINE,
               geometry: GEOM_LINE,
               ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
               version: VERSION_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, null, CQL_LINE, VERSION_LINE);
         });
         test('Objeto (1.5) - Line: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: wfS,
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE,
               cql: CQL_LINE,
               geometry: GEOM_LINE,
               ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
               version: VERSION_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, null, CQL_LINE, VERSION_LINE);
         });
         test('Objeto (2) - Line: url, namespace, name, legend, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE,
               geometry: GEOM_LINE,
               ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
               version: VERSION_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, [FEATURE_ID1_LINE, FEATURE_ID2_LINE], null, VERSION_LINE);
         });
         test('Objeto (3) - Line: url, namespace, name, legend, geom, ids', function () {
            var layer = new M.layer.WFS({
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE,
               geometry: GEOM_LINE,
               ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE]
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE, [FEATURE_ID1_LINE, FEATURE_ID2_LINE]);
         });
         test('Objeto (4) - Line: url, namespace, name, legend, geom', function () {
            var layer = new M.layer.WFS({
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE,
               geometry: GEOM_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               GEOM_LINE, TITLE_LINE);
         });
         test('Objeto (5) - Line: url, namespace, name, legend', function () {
            var layer = new M.layer.WFS({
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE,
               legend: TITLE_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE,
               null, TITLE_LINE);
         });
         test('Objeto (6) - Line: url, namespace, name', function () {
            var layer = new M.layer.WFS({
               url: URL_LINE,
               namespace: NAMESPACE_LINE,
               name: NAME_LINE
            });

            suiteModule.asserts.layerIsWFS(layer, URL_LINE, NAMESPACE_LINE, NAME_LINE);
         });
         // Objecto - Polygon
         test('Objeto (1.1) - Point: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL,
               cql: CQL_POL,
               geometry: GEOM_POL,
               ids: [FEATURE_ID1_POL, FEATURE_ID2_POL],
               version: VERSION_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, null, CQL_POL, VERSION_POL);
         });
         test('Objeto (1.2) - Polygon: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: WFST,
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL,
               cql: CQL_POL,
               geometry: GEOM_POL,
               ids: [FEATURE_ID1_POL, FEATURE_ID2_POL],
               version: VERSION_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, null, CQL_POL, VERSION_POL);
         });
         test('Objeto (1.3) - Polygon: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: wfST,
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL,
               cql: CQL_POL,
               geometry: GEOM_POL,
               ids: [FEATURE_ID1_POL, FEATURE_ID2_POL],
               version: VERSION_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, null, CQL_POL, VERSION_POL);
         });
         test('Objeto (1.4) - Polygon: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: WFS,
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL,
               cql: CQL_POL,
               geometry: GEOM_POL,
               ids: [FEATURE_ID1_POL, FEATURE_ID2_POL],
               version: VERSION_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, null, CQL_POL, VERSION_POL);
         });
         test('Objeto (1.5) - Polygon: url, namespace, name, legend, cql, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               type: wfS,
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL,
               cql: CQL_POL,
               geometry: GEOM_POL,
               ids: [FEATURE_ID1_POL, FEATURE_ID2_POL],
               version: VERSION_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, null, CQL_POL, VERSION_POL);
         });
         test('Objeto (2) - Polygon: url, namespace, name, legend, geom, ids, version', function () {
            var layer = new M.layer.WFS({
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL,
               geometry: GEOM_POL,
               ids: [FEATURE_ID1_POL, FEATURE_ID2_POL],
               version: VERSION_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, [FEATURE_ID1_POL, FEATURE_ID2_POL], null, VERSION_POL);
         });
         test('Objeto (3) - Polygon: url, namespace, name, legend, geom, ids', function () {
            var layer = new M.layer.WFS({
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL,
               geometry: GEOM_POL,
               ids: [FEATURE_ID1_POL, FEATURE_ID2_POL]
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL, [FEATURE_ID1_POL, FEATURE_ID2_POL]);
         });
         test('Objeto (4) - Polygon: url, namespace, name, legend, geom', function () {
            var layer = new M.layer.WFS({
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL,
               geometry: GEOM_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               GEOM_POL, TITLE_POL);
         });
         test('Objeto (5) - Polygon: url, namespace, name, legend', function () {
            var layer = new M.layer.WFS({
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL,
               legend: TITLE_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL,
               null, TITLE_POL);
         });
         test('Objeto (6) - Polygon: url, namespace, name', function () {
            var layer = new M.layer.WFS({
               url: URL_POL,
               namespace: NAMESPACE_POL,
               name: NAME_POL
            });

            suiteModule.asserts.layerIsWFS(layer, URL_POL, NAMESPACE_POL, NAME_POL);
         });
         test('Falla porque no especifico ningún parámetro', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS();
            });
         });
         test('Falla porque especifico un parámetro nulo', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS(null);
            });
         });
         test('Falla porque especifico un objeto vacío', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS({});
            });
         });
         test('Falla porque especifico un objeto con propiedades erróneas', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS({
                  nombre: NAME_POINT,
                  URL: URL_POINT
               });
            });
         });
         test('Falla porque especifico mal el orden de los parámetros de la cadena: TITLE*WFST*URL*NAMESPACE:NAME*GEOM*FEATURE_ID1-FEATURE_ID2', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS(TITLE_POINT.concat('*').concat(WFST)
                  .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
                  .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
                  .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS('tipoInexistente'.concat('*').concat(TITLE_POINT)
                  .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
                  .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
                  .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));
            });
         });
         test('Falla porque el tipo no es un tipo reconocido (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS({
                  type: 'tipoInexistente',
                  url: URL_LINE,
                  namespace: NAMESPACE_LINE,
                  name: NAME_LINE,
                  legend: TITLE_LINE,
                  cql: CQL_LINE,
                  geometry: GEOM_LINE,
                  ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
                  version: VERSION_LINE
               });
            });
         });
         test('Falla porque el tipo no es WMS (1)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS('KML'.concat('*').concat(TITLE_POINT)
                  .concat('*').concat(URL_POINT).concat('*').concat(NAMESPACE_POINT)
                  .concat(':').concat(NAME_POINT).concat('*').concat(GEOM_POINT)
                  .concat('*').concat(FEATURE_ID1_POINT).concat('-').concat(FEATURE_ID2_POINT));
            });
         });
         test('Falla porque el tipo no es WMS (2)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS({
                  type: 'KML',
                  url: URL_LINE,
                  namespace: NAMESPACE_LINE,
                  name: NAME_LINE,
                  legend: TITLE_LINE,
                  cql: CQL_LINE,
                  geometry: GEOM_LINE,
                  ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
                  version: VERSION_LINE
               });
            });
         });
         test('Falla porque el tipo no es WMS (3)', function () {
            assert.throw(function () {
               var layer = new M.layer.WFS({
                  type: M.layer.type.KML,
                  url: URL_LINE,
                  namespace: NAMESPACE_LINE,
                  name: NAME_LINE,
                  legend: TITLE_LINE,
                  cql: CQL_LINE,
                  geometry: GEOM_LINE,
                  ids: [FEATURE_ID1_LINE, FEATURE_ID2_LINE],
                  version: VERSION_LINE
               });
            });
         });
      });
   };
})(window.mapeaSuite.wfs || {});