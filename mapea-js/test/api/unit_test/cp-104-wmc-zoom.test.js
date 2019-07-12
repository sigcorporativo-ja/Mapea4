import { createMapAndWait } from './test-utils';

const ZOOM = 10;

/**
 * Max Extent test
 *
 * @testsuite
 */
describe(`CP-104 WMC por defecto con zoom ${ZOOM}`, () => {
  let mapjs;
  before(async function mapCreation() {
    M.config.DEFAULT_PROJ = 'EPSG:23030*m';
    this.timeout(10000);
    mapjs = await createMapAndWait({
      container: "map",
      zoom: ZOOM,
    });
  });
  describe('Cálculo maxExtent con dos WMS', () => {
    it(`Tiene zoom ${ZOOM}`, () => {
      const zoom = mapjs.getZoom();
      expect(zoom).to.be(ZOOM);
    });
  });
});
