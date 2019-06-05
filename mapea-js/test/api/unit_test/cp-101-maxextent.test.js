import { createMapAndWait } from './test-utils';

/**
 * Max Extent test
 *
 * @testsuite
 */
describe('CP-101 Gestión del MaxExtent', () => {
  let mapjs;
  before(async function mapCreation() {
    this.timeout(10000);
    mapjs = await createMapAndWait({
      container: "map",
      layers: [
        "WMS*Municipios*http://www.ideandalucia.es/wms/dea100_divisiones_administrativas?*terminos_municipales*false*true",
        "WMS*Mapa*http://www.ideandalucia.es/services/andalucia/wms?*00_Mapa_Andalucia*true*false",
      ],
    });
  });
  describe('Cálculo maxExtent con dos WMS', () => {
    it('Tiene zoom 0', () => {
      const zoom = mapjs.getZoom();
      expect(zoom).to.be(0);
    });
  });
});
