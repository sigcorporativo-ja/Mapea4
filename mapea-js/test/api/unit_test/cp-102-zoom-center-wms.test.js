import { createMapAndWait } from './test-utils';

/**
 * Max Extent test
 *
 * @testsuite
 */
describe('CP-102 Zoom y center con capas WMS', () => {
  let mapjs, mapjs2;
  const CENTER = [197028, 4182700];
  const ZOOM2 = 5;
  before(async function mapCreation() {
    this.timeout(10000);
    mapjs = await createMapAndWait({
      container: 'map',
      layers: [
        'WMS*Limites provinciales de Andalucia*http://www.ideandalucia.es/wms/mta400v_2008?*Division_Administrativa*false',
        'WMS*Ortofoto Andalucia 2013*http://www.ideandalucia.es/wms/ortofoto2013?*oca10_2013*false',
        'WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_modelo_altura_vege_incendio_la_granada_rio_tinto?*true',
        'WMS*Nucleos de Poblacion*http://www.ideandalucia.es/wms/mta100v_2005?*Nucleos_de_Poblacion*true',
        'WMS*Toponimia*http://www.ideandalucia.es/wms/mta100v_2005?*Toponimia_Nucleos_de_Poblacion*true',
      ],
      controls: ['layerswitcher', 'panzoom'],
      center: CENTER,
    });
    mapjs2 = await createMapAndWait({
      container: 'map',
      layers: [
        'WMS*Limites provinciales de Andalucia*http://www.ideandalucia.es/wms/mta400v_2008?*Division_Administrativa*false',
        'WMS*Ortofoto Andalucia 2013*http://www.ideandalucia.es/wms/ortofoto2013?*oca10_2013*false',
        'WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_modelo_altura_vege_incendio_la_granada_rio_tinto?*true',
        'WMS*Nucleos de Poblacion*http://www.ideandalucia.es/wms/mta100v_2005?*Nucleos_de_Poblacion*true',
        'WMS*Toponimia*http://www.ideandalucia.es/wms/mta100v_2005?*Toponimia_Nucleos_de_Poblacion*true',
      ],
      controls: ['layerswitcher', 'panzoom'],
      zoom: ZOOM2,
      center: CENTER,
    });
  });
  describe('El centro debe ser el especificado', () => {
    it('Tiene zoom 0 y 5 respectivamente', () => {
      const zoom = mapjs.getZoom();
      const zoom2 = mapjs2.getZoom();
      expect(zoom).to.be(0);
      expect(zoom2).to.be(ZOOM2);
    });
    it('Tiene el centro especificado', () => {
      const center = mapjs.getCenter();
      const center2 = mapjs2.getCenter();
      expect([center.x, center.y]).to.be.eql(CENTER);
      expect([center2.x, center2.y]).to.be.eql(CENTER);
    });
  });
});
