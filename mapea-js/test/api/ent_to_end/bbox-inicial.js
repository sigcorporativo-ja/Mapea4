const expect = require('expect.js');
const server = require('../server.js');

const PORT = 9999;

server.listen(PORT);

const TEST_BBOX = [450137.6602065728, 4079774.2048711563, 480763.617682564, 4100039.975169722];
const URL = `http://localhost:${PORT}/test/production/generic-case.html?bbox=${TEST_BBOX}`;

module.exports = {
  before: (browser) => {
    browser
      .url(URL)
      .waitForElementPresent('div#mapLoaded');
  },

  'Comprobamos que el bbox inicial es el especificado': (browser) => {
    browser
      // gets bbox
      .execute('return mapjs.getBbox()', [], function({ value }) {
        const { x, y } = value;
        expect(Math.abs(x.min - TEST_BBOX[0])).to.be.lessThan(10000);
        expect(Math.abs(y.min - TEST_BBOX[1])).to.be.lessThan(10000);
        expect(Math.abs(x.max - TEST_BBOX[2])).to.be.lessThan(10000);
        expect(Math.abs(y.max - TEST_BBOX[3])).to.be.lessThan(10000);
      })
      .end(() => server.close());
  },
};
