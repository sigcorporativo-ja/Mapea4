const assert = require('assert');
const server = require('../server.js');

const PORT = 9999;

server.listen(PORT);

const URL_SIMPLE = `http://localhost:${PORT}/test/production/generic-case.html?wmcfile=cdau,cdau_satelite,cdau_hibrido&controls=navtoolbar,layerswitcher`;
const URL_ZOOM_CENTER = `http://localhost:${PORT}/test/production/generic-case.html?zoom=8&center=206137.44286825173,4046855.8930291412&wmcfile=cdau,cdau_satelite,cdau_hibrido&controls=navtoolbar,layerswitcher`;

module.exports = {

  'Compararmos BBOX después de cambio de contexto': (browser) => {
    browser
      .url(URL_ZOOM_CENTER)
      .assert.elementPresent('.m-control.m-wmcselector-container.g-cartografia-mapa')
      .pause(1000)
      .execute('window.bbox1 = mapjs.getBbox();', [])
      .click('.m-wmcselector-select option[value*=context_cdau_satelite]')
      .pause(2000)
      .execute(`
        const bbox2 = mapjs.getBbox();
        return (window.bbox1.x.min === bbox2.x.min &&
          window.bbox1.y.min === bbox2.y.min &&
          window.bbox1.x.max === bbox2.x.max &&
          window.bbox1.y.max === bbox2.y.max)
        `, [], function({ value }) {
        assert.ok(value);
      })
  },

  'Comparamos BBOX con zoom y center después de cambio de contexto': (browser) => {
    browser
      .url(URL_SIMPLE)
      .assert.elementPresent('.m-control.m-wmcselector-container.g-cartografia-mapa')
      .pause(1000)
      .execute(`
        mapjs.setZoom(8);
        mapjs.setCenter([206137.44286825173, 4046855.8930291412]);
        `, [])
      .pause(1000)
      .execute('window.bbox1 = mapjs.getBbox();', [])
      .click('.m-wmcselector-select option[value*=context_cdau_satelite]')
      .pause(2000)
      .execute(`
        const bbox2 = mapjs.getBbox();
        return (window.bbox1.x.min === bbox2.x.min &&
          window.bbox1.y.min === bbox2.y.min &&
          window.bbox1.x.max === bbox2.x.max &&
          window.bbox1.y.max === bbox2.y.max)`, [], function({ value }) {
        assert.ok(value);
      })
  },

  'Comparamos BBOX centrando con el ratón y después cambiar de contexto': (browser) => {
    browser
      .url(URL_SIMPLE)
      .assert.elementPresent('.m-control.m-wmcselector-container.g-cartografia-mapa')
      .pause(1000)
      // zoom in 5 times
      .moveToElement('div#map', 400, 400)
      .doubleClick()
      .pause(500)
      .doubleClick()
      .pause(500)
      .doubleClick()
      .pause(500)
      .doubleClick()
      .pause(500)
      .doubleClick()
      .pause(500)
      .execute('window.bbox1 = mapjs.getBbox();', [])
      .click('.m-wmcselector-select option[value*=context_cdau_satelite]')
      .pause(2000)
      .execute(`
        const bbox2 = mapjs.getBbox();
        return (window.bbox1.x.min === bbox2.x.min &&
          window.bbox1.y.min === bbox2.y.min &&
          window.bbox1.x.max === bbox2.x.max &&
          window.bbox1.y.max === bbox2.y.max)
        `, [], function({ value }) {
        assert.ok(value);
      })
      .end(() => server.close());
  },

};
