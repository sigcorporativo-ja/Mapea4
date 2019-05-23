const assert = require('assert');
const server = require('../server.js');

const PORT = 9999;

server.listen(PORT);

const URL_TWO_OVERLAYS = `http://localhost:${PORT}/test/production/generic-case.html?layers=WMS*Municipios*http://www.ideandalucia.es/wms/dea100_divisiones_administrativas?*terminos_municipales*true*true,WMS*Mapa*http://www.ideandalucia.es/services/andalucia/wms?*00_Mapa_Andalucia*true*false`;
const URL_BASE_OVERLAY = `http://localhost:${PORT}/test/production/generic-case.html?layers=WMS*Municipios*http://www.ideandalucia.es/wms/dea100_divisiones_administrativas?*terminos_municipales*false*true,WMS*Mapa*http://www.ideandalucia.es/services/andalucia/wms?*00_Mapa_Andalucia*true*false`;

module.exports = {
  'Compararmos BBOX y MaxExtent para dos capas WMS overlays': (browser) => {
    browser
      .url(URL_TWO_OVERLAYS)
      .pause(3000)
      .execute('return mapjs.getMaxExtent()', [], function({ value }) {
        assert.deepEqual(value, [-1321568.3909080406, 3039517.894971682, 1268936.9730228332, 5023938.0324756205]);
      })
      .execute('return mapjs.getCenter()', [], function({ value }) {
        assert.equal(value.x, -26315.70894260367);
        assert.equal(value.y, 4031727.963723651);
      })
      .execute('return mapjs.getResolutions()', [], function({ value }) {
        assert.deepEqual(value, [4231.173001074495, 2115.5865005372475, 1057.7932502686238, 528.8966251343119, 264.44831256715594, 132.22415628357797, 66.11207814178898, 33.05603907089449, 16.528019535447246, 8.264009767723623, 4.1320048838618115, 2.0660024419309058, 1.0330012209654529, 0.5165006104827264, 0.2582503052413632, 0.1291251526206816]);
      });
  },

  'Comparamos BBOX y MaxExtent para una capa WMS base y otra Overlay': (browser) => {
    browser
      .url(URL_BASE_OVERLAY)
      .pause(3000)
      .execute('return mapjs.getMaxExtent()', [], function({ value }) {
        assert.deepEqual(value, [-1321568.3909080406, 3039517.894971682, 1268936.9730228332, 5023938.0324756205]);
      })
      .execute('return mapjs.getCenter()', [], function({ value }) {
        assert.equal(value.x, -26315.70894260367);
        assert.equal(value.y, 4031727.963723651);
      })
      .end(() => server.close());
  },
};
