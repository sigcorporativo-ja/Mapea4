import { createMapAndWait, almostEquals } from './test-utils';

/**
 * Max Extent test
 *
 * @testsuite
 */
describe('Cambiar la proyección del mapa una vez esté construido', async () => {
  const POINTS = [
    { center: [-5.9337, 37.3389], projection: 'EPSG:4326*d' },
    { center: [240103.69, 4136506.40], projection: 'EPSG:25830*m' },
    { center: [-660536.46, 4486450.94], projection: 'EPSG:3857*m' },
    { center: [-5.9337, 37.3389], projection: 'EPSG:4258*d' },
    { center: [240202.85, 4136708.95], projection: 'EPSG:23030*m' },
  ];
  const ZOOM = 14;
  const initCenter = POINTS[0].center;
  const initProj = POINTS[0].projection;
  const mapjs = await createMapAndWait({
    container: 'map',
    layers: [
      'WMS*Limites provinciales de Andalucia*http://www.ideandalucia.es/wms/mta400v_2008?*Division_Administrativa*false',
      'WMS*Ortofoto Andalucia 2013*http://www.ideandalucia.es/wms/ortofoto2013?*oca10_2013*false',
      'WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_modelo_altura_vege_incendio_la_granada_rio_tinto?*true',
      'WMS*Nucleos de Poblacion*http://www.ideandalucia.es/wms/mta100v_2005?*Nucleos_de_Poblacion*true',
      'WMS*Toponimia*http://www.ideandalucia.es/wms/mta100v_2005?*Toponimia_Nucleos_de_Poblacion*true',
    ],
    controls: ['layerswitcher', 'panzoom'],
    center: initCenter,
    projection: initProj,
    zoom: ZOOM,
  });

  describe('El centro debe ser el de la proyección', () => {
    const mapProj = mapjs.getProjection().code;
    const mapCenter = mapjs.getCenter();
    it('Tiene la proyección indicada', () => {
      expect(mapProj).to.be(initProj.split('*')[0]);
    });
    it('Tiene el centro especificado', () => {
      almostEquals([mapCenter.x, mapCenter.y], initCenter);
    });
  });
  describe(`Cambiamos de proyección a ${POINTS[1].projection}`, () => {
    const { center, projection } = POINTS[1];
    mapjs.setProjection(projection);
    const mapProj = mapjs.getProjection().code;
    const mapCenter = mapjs.getCenter();
    it('Tiene la proyección indicada', () => {
      expect(mapProj).to.be(projection.split('*')[0]);
    });
    it('Tiene el centro especificado', () => {
      almostEquals([mapCenter.x, mapCenter.y], center);
    });
  });
  describe(`Cambiamos de proyección a ${POINTS[2].projection}`, () => {
    const { center, projection } = POINTS[2];
    mapjs.setProjection(projection);
    const mapProj = mapjs.getProjection().code;
    const mapCenter = mapjs.getCenter();
    it('Tiene la proyección indicada', () => {
      expect(mapProj).to.be(projection.split('*')[0]);
    });
    it('Tiene el centro especificado', () => {
      almostEquals([mapCenter.x, mapCenter.y], center);
    });
  });
  describe(`Cambiamos de proyección a ${POINTS[3].projection}`, () => {
    const { center, projection } = POINTS[3];
    mapjs.setProjection(projection);
    const mapProj = mapjs.getProjection().code;
    const mapCenter = mapjs.getCenter();
    it('Tiene la proyección indicada', () => {
      expect(mapProj).to.be(projection.split('*')[0]);
    });
    it('Tiene el centro especificado', () => {
      almostEquals([mapCenter.x, mapCenter.y], center, 0.1);
    });
  });
  describe(`Cambiamos de proyección a ${POINTS[4].projection}`, () => {
    const { center, projection } = POINTS[4];
    mapjs.setProjection(projection);
    const mapProj = mapjs.getProjection().code;
    const mapCenter = mapjs.getCenter();
    it('Tiene la proyección indicada', () => {
      expect(mapProj).to.be(projection.split('*')[0]);
    });
    it('Tiene el centro especificado', () => {
      almostEquals([mapCenter.x, mapCenter.y], center);
    });
  });
});
