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
        return (window.bbox1[0] === bbox2[0] &&
          window.bbox1[1] === bbox2[1] &&
          window.bbox1[2] === bbox2[2] &&
          window.bbox1[3] === bbox2[3])`, [], function({ value }) {
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
        return (window.bbox1[0] === bbox2[0] &&
          window.bbox1[1] === bbox2[1] &&
          window.bbox1[2] === bbox2[2] &&
          window.bbox1[3] === bbox2[3])`, [], function({ value }) {
        assert.ok(value);
      })
      .end(() => server.close());
  },

};
