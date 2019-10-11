const expect = require('expect.js');
const getColors = require('get-image-colors');
const server = require('../server.js');

const PORT = 9999;

server.listen(PORT);

const URL = `http://localhost:${PORT}/test/production/generic-case.html?layers=OSM&controls=layerswitcher`;

module.exports = {
  before: function before(browser) {
    browser
      .url(URL)
      .waitForElementPresent('div#mapLoaded')
      .execute(`
        const provincias = new M.layer.WFS({
          url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
          namespace: 'tematicos',
          name: 'Provincias',
          legend: 'Provincias',
          geometry: 'MPOLYGON',
          ids: '3,4',
        });
        const municipios = new M.layer.GeoJSON({
          url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=50&outputFormat=application%2Fjson',
          name: 'Municipios',
        });
        const distritosSanitarios = new M.layer.GeoJSON({
          url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:distrito_sanitario&maxFeatures=50&outputFormat=application%2Fjson',
          name: 'Distritos Sanitarios',
        });
        const layerGroup = new M.layer.LayerGroup(undefined, 'Grupo de Prueba');
        layerGroup.addChild(provincias);
        layerGroup.addChild(municipios);
        layerGroup.addChild(distritosSanitarios);
        mapjs.addLayerGroup(layerGroup);
      `, []);
  },
  'Se muestra el grupo en el layerswitcher y se despliega correctamente': (browser) => {
    browser.moveToElement('.m-panel.m-layerswitcher.collapsed', 25, 25)
      .mouseButtonClick()
      .pause(750)
      .moveToElement('#m-layerswitcher-panel li.m-group > ul.m-groups > li.m-group.m-collapsed', 25, 25)
      .mouseButtonClick()
      .pause(750)
      .expect.element('#m-layerswitcher-panel li.m-group ul.m-groups > li.m-group > ul.m-layers > li.m-layer.visible').to.be.present;
  },
  'Se hace click en el grupo y se ocultan todas las capas': (browser) => {
    browser
      .moveToElement('#m-layerswitcher-panel ul.m-groups div.m-visible-control > span', 1, 1)
      .mouseButtonClick()
      .pause(750)
      .execute(`
      return mapjs.getLayerGroup()[0].getAllLayers().map(l => l.isVisible());
      `, [], function({ value }) {
        expect(value).to.have.length(3);
        expect(value).to.eql([false, false, false]);
      });
  },
  'Se hace click en el grupo de nuevo y se muestran todas las capas': (browser) => {
    browser
      .moveToElement('#m-layerswitcher-panel ul.m-groups div.m-visible-control > span', 1, 1)
      .mouseButtonClick()
      .pause(750)
      .execute(`
      return mapjs.getLayerGroup()[0].getAllLayers().map(l => l.isVisible());
      `, [], function({ value }) {
        expect(value).to.have.length(3);
        expect(value).to.eql([true, true, true]);
      });
  },
  'Se hace click sobre una capa del grupo y se oculta sólo esa capa': (browser) => {
    browser
      .moveToElement('#m-layerswitcher-panel div.m-visible-control > span[data-layer-name="Municipios"', 2, 2)
      .mouseButtonClick()
      .pause(750)
      .assert.cssClassPresent('#m-layerswitcher-panel ul.m-groups div.m-visible-control > span', 'g-cartografia-check5')
      .pause(750)
      .execute(`
      return mapjs.getLayerGroup()[0].getAllLayers().find(v => v.name === 'Municipios').isVisible();
      `, [], function({ value }) {
        expect(value).not.to.be(true);
      })
      .end(() => server.close());
  },
};
