import { createMapAndWait } from './test-utils';

/**
 * Max Extent test
 *
 * @testsuite
 */
describe('Evento CHANGE_PROJ y CHANGE al cambiar de proyección', () => {
  let mapjs;
  before(async function mapCreation() {
    this.timeout(5000);
    mapjs = await createMapAndWait({
      container: 'map',
      layers: ['OSM'],
      projection: 'EPSG:4326*d',
      zoom: 6,
    });
  });
  describe('Registramos los eventos CHANGE y CHANGE_PROJ', function() {
    it('Al cambiar de proyección sólo se dispara el método CHANGE_PROJ', function(done) {
      this.timeout(5000);
      let facadeFired = false;
      let implFired = false;
      mapjs.getImpl().on(M.evt.CHANGE, () => {
        expect().fail("Se dispara el evento CHANGE");
        implFired = true;
        if (facadeFired && implFired) {
          done();
        }
      });
      mapjs.on(M.evt.CHANGE_PROJ, () => done());
      mapjs.setProjection('EPSG:25830*m');
    });
  });
});
