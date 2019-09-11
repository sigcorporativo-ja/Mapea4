/* eslint-disable */
import { createMapAndWait } from './test-utils';

/**
 * GroupLayer test
 *
 * @testsuite
 */
describe('CP del Grupo de Capas por API', () => {
  let mapjs;
  let provincias, municipios, distritosSanitarios;
  let layerGroup1, layerGroup2;
  beforeEach(async function mapCreation() {
    mapjs = await createMapAndWait({
      container: 'map',
      'layers': ['OSM'],
      controls: ['layerswitcher'],
    });
    provincias = new M.layer.WFS({
      url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
      namespace: 'tematicos',
      name: 'Provincias',
      legend: 'Provincias',
      geometry: 'MPOLYGON',
      ids: '3,4',
    });
    municipios = new M.layer.GeoJSON({
      url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=50&outputFormat=application%2Fjson',
      name: 'Municipios',
    });
    distritosSanitarios = new M.layer.GeoJSON({
      url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:distrito_sanitario&maxFeatures=50&outputFormat=application%2Fjson',
      name: 'Distritos Sanitarios',
    });
    layerGroup1 = new M.layer.LayerGroup({
      title: 'Grupo 1',
      id: 'id_grupo',
      order: 1,
      children: [provincias, distritosSanitarios],
      zIndex: 500,
      collapsed: false,
    });

    layerGroup2 = new M.layer.LayerGroup({
      title: 'Grupo 2',
      id: 'id_grupo2',
      order: 1,
      zIndex: 700,
      children: [],
      collapsed: false,
    });
  });
  describe('Gestión con el grupo de capas', () => {
    it('Constructor de layerGroup', () => {
      const { title, id, order, collapsed } = layerGroup1;
      expect(title).to.be('Grupo 1');
      expect(id).to.be('id_grupo');
      expect(order).to.be(1);
      expect(collapsed).to.be(false);
      expect(layerGroup1.getZIndex()).to.be(500);
      expect(layerGroup1.getChildren()).to.be.an('array');

    });
    it('El zIndex de las capas es el correcto', function(done) {
      mapjs.addLayerGroup(layerGroup1);
      const layers = layerGroup1.getChildren();
      layers[0].on(M.evt.LOAD, () => {
        expect(layers[0].getZIndex()).to.be(500);
        done();
      });
    });

    it('Creamos un grupo y añadimos todas las capas', () => {
      layerGroup2.addChildren([provincias, distritosSanitarios]);
      expect(layerGroup2.getChildren()).to.be.an('array');
      expect(layerGroup2.getChildren().length).to.be(2);
    });

    it('Tenemos dos grupos de capas añadidos.', () => {
      mapjs.addLayerGroup(layerGroup2);
      mapjs.addLayerGroup(layerGroup1);
      expect(mapjs.getLayerGroup()).to.be.an('array');
      expect(mapjs.getLayerGroup().length).to.be(2);
    });

    it('El zIndex de la capa al añadirla al grupo', function() {
      layerGroup2.addChild(municipios);
      expect(municipios.getZIndex()).to.be(700);
    });
  });
});
