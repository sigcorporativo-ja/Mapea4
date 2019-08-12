const server = require('../server.js');
const URL = port => `http://localhost:${port}/test/production/basic-map.html`;
const PORT = 9999;

server.listen(PORT);

module.exports = {
  'Click layerswitcher': (browser) => {
    browser
      .url(URL(PORT))
      .assert.cssClassPresent('.m-layerswitcher', 'collapsed')
      .click('.m-layerswitcher > button')
      .pause(1000)
      .assert.cssClassPresent('.m-layerswitcher', 'opened')
      .click('.m-layerswitcher > button')
      .pause(1000)
      .assert.cssClassPresent('.m-layerswitcher', 'collapsed')
      .end(() => server.close());
  },
};
