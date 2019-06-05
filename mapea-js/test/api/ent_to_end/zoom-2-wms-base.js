const expect = require('expect.js');
const server = require('../server.js');

const PORT = 9999;

server.listen(PORT);

const URL = `http://localhost:${PORT}/test/production/generic-case.html?layers=WMS*Limites%20provinciales%20de%20Andalucia*http://www.ideandalucia.es/wms/mta400v_2008?*Division_Administrativa*false,WMS*Ortofoto%20Andalucia%202013*http://www.ideandalucia.es/wms/ortofoto2013?*oca10_2013*false,WMS_FULL*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_modelo_altura_vege_incendio_la_granada_rio_tinto?*true,WMS*Nucleos%20de%20Poblacion*http://www.ideandalucia.es/wms/mta100v_2005?*Nucleos_de_Poblacion*true,WMS*Toponimia*http://www.ideandalucia.es/wms/mta100v_2005?*Toponimia_Nucleos_de_Poblacion*true&controls=layerswitcher,panzoom&zoom=5&center=197028,4182700`;

module.exports = {
  before: (browser) => {
    browser
      .url(URL)
      .waitForElementPresent('div#mapLoaded');
  },

  'Comprobamos que al hacer zoom y cambiar de capa base no se modifica': (browser) => {
    let prevBbox;
    browser
      // zooms in 3 times
      .moveToElement('#map div.ol-overlaycontainer-stopevent button.ol-zoom-in', 5, 5)
      .mouseButtonClick()
      .pause(750)
      .mouseButtonClick()
      .pause(750)
      .mouseButtonClick()
      .pause(750)
      // gets bbox
      .execute('return mapjs.getBbox()', [], function({ value }) {
        prevBbox = value;
      })
      // opens layerswitcher and changes the base layer clicking over it
      .moveToElement('.m-panel.m-layerswitcher.collapsed', 25, 25)
      .mouseButtonClick()
      .pause(750)
      .moveToElement('div#m-layerswitcher-panel li.group div.layer-base span.m-check.g-cartografia-check4', 2, 2)
      .mouseButtonClick()
      .pause(750)
      // gets the new bbox
      .execute('return mapjs.getBbox()', [], function({ value }) {
        expect(value).to.be.eql(prevBbox);
      })
      // changes the base layer again
      .moveToElement('div#m-layerswitcher-panel li.group div.layer-base span.m-check.g-cartografia-check4', 2, 2)
      .mouseButtonClick()
      .pause(750)
      .execute('return mapjs.getBbox()', [], function({ value }) {
        expect(value).to.be.eql(prevBbox);
      })
      .end(() => server.close());
  },
};
