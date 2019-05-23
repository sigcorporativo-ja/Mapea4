import { createMapAndWait } from './test-utils';

/**
 * GroupLayer test
 *
 * @testsuite
 */
describe('CP del Grupo de Capas por API', () => {
  let mapjs;
  let provincias, municipios, distritosSanitarios;

  before(async function mapCreation() {
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
  });
  describe('Gestión con el grupo de capas', () => {
    it('Creamos grupo y añadimos una a una las capas', () => {
      const layerGroup = new M.layer.LayerGroup(undefined, 'Grupo de Prueba');
      layerGroup.addChild(provincias);
      layerGroup.addChild(municipios);
      layerGroup.addChild(distritosSanitarios);
      mapjs.addLayerGroup(layerGroup);

      const layerGroups = mapjs.getLayerGroup();
      expect(layerGroups).to.be.an('array');
      expect(layerGroups).to.have.length(1);

      const addedLayerGroup = layerGroups[0];
      expect(addedLayerGroup).to.be.a(M.layer.LayerGroup);
      expect(addedLayerGroup.title).to.eql(layerGroup.title);

      const layers = addedLayerGroup.getChildren();
      expect(layers).to.be.an('array');
      expect(layers).to.have.length(3);
      expect(layers).to.contain(provincias);
      expect(layers).to.contain(municipios);
      expect(layers).to.contain(distritosSanitarios);
    });
    it('Creamos un grupo y añadimos de golpe todas las capas', () => {
      const layerGroup = new M.layer.LayerGroup(undefined, 'Grupo de Prueba 2');
      layerGroup.addChildren([provincias, municipios, distritosSanitarios]);
      mapjs.addLayerGroup(layerGroup);
      const layerGroups = mapjs.getLayerGroup();
      expect(layerGroups).to.be.an('array');
      expect(layerGroups).to.have.length(2);

      const addedLayerGroup = layerGroups[1];
      expect(addedLayerGroup).to.be.a(M.layer.LayerGroup);
      expect(addedLayerGroup.title).to.eql(layerGroup.title);

      const layers = addedLayerGroup.getChildren();
      expect(layers).to.be.an('array');
      expect(layers).to.have.length(3);
      expect(layers).to.contain(provincias);
      expect(layers).to.contain(municipios);
      expect(layers).to.contain(distritosSanitarios);
    });
    it('Eliminamos una capa del grupo de capas.', () => {
      const layerGroups = mapjs.getLayerGroup();
      const layerGroup = layerGroups[0];

      layerGroup.removeChild(provincias);
      const layers = layerGroup.getChildren();
      expect(layers).to.be.an('array');
      expect(layers).to.have.length(2);
      expect(layers).to.contain(municipios);
      expect(layers).to.contain(distritosSanitarios);
      expect(layers).not.to.contain(provincias);
    });
  });
});
