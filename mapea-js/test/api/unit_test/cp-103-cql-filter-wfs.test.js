import { createMapAndWait } from './test-utils';

/**
 * Max Extent test
 *
 * @testsuite
 */
describe('CP-103 Capa WFS y filtro CQL', () => {
  let mapjs, gridWFS;
  before(async function mapCreation() {
    this.timeout(5000);
    mapjs = await createMapAndWait({
      container: 'map',
      controls: ['layerswitcher']
    });
    gridWFS = new M.layer.WFS({
      url: "http://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/grid/wfs?",
      namespace: "grid",
      name: "gridp_250",
      legend: "Grid",
      geometry: 'MPOLYGON',
      version: '2.0',
      cql: "cmun LIKE '%18005%'",
    });
    mapjs.addWFS(gridWFS);
  });
  describe('Añadimos capa WFS con filtro CQL por municipio', () => {
    it('Todos los features cumplen el filtro cql', (done) => {
      gridWFS.once(M.evt.LOAD, () => {
        const features = gridWFS.getFeatures();
        expect(features.every(f => /.*18005.*/.test(f.getAttribute('cmun')))).to.be.ok();
        done();
      });
    });
  });
  describe('Cambiamos el filtro CQL por otro', () => {
    it('Todos los features cumplen el filtro cql', function test2(done) {
      this.timeout(10000);
      gridWFS.once(M.evt.LOAD, () => {
        const features = gridWFS.getFeatures();
        expect(features.every(f => f.getAttribute('cmun').indexOf('18006') !== -1)).to.be.ok();
        done();
      });
      gridWFS.setCQL("cmun LIKE '%18006%'");
    });
  });
});
