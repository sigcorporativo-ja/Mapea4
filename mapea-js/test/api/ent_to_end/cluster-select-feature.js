const expect = require('expect.js');
const getColors = require('get-image-colors');
const server = require('../server.js');

const PORT = 9999;

server.listen(PORT);

const URL = `http://localhost:${PORT}/test/production/generic-case.html?controls=navtoolbar&center=207466.3075900239,4111805.649363984&zoom=8`;

module.exports = {
  before: function before(browser) {
    browser
      .url(URL)
      .pause(3000).execute(`
        var campamentos = new M.layer.WFS({
          name: "Campamentos",
          url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs",
          namespace: "sepim",
          name: "campamentos",
          geometry: 'POINT',
          extract: true
        });
        mapjs.addLayers(campamentos);
        let reserva_st = new M.style.Polygon({
          fill: {
            color: 'rgb(223, 115, 255)'
          }
        });
        var reservas = new M.layer.WFS({
          name: "reservas_biosfera",
          namespace: "reservas_biosfera",
          legend: "Reservas biosferas",
          geometry: "POLYGON",
          url: "https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_WFS_Patrimonio_Natural?",
          version: "1.1.0"
        }, {
          getFeatureOutputFormat: 'geojson',
          describeFeatureTypeOutputFormat: 'geojson'
        });
        reservas.setStyle(reserva_st);
        reservas.on(M.evt.LOAD, () => {
          const divElem = document.createElement('div');
          divElem.id = 'reservasLoaded';
          divElem.style.display = 'none';
          document.body.appendChild(divElem);
        });
        mapjs.addLayers(reservas);
        mapjs.getFeatureHandler().removeLayer(reservas);
        campamentos.on(M.evt.SELECT_FEATURES, function(features, evt) {
          if (features[0] instanceof M.ClusteredFeature) {
            console.log('Es un cluster:', features[0].getAttribute('features'));
          } else {
            console.log('NO es un cluster:', features);
          }
        });

        //Estilos para categorización
        let primera = new M.style.Point({
          icon: {
            src: 'https://image.flaticon.com/icons/svg/34/34697.svg',
            scale: 0.1
          },
        });
        let segunda = new M.style.Point({
          icon: {
            src: 'https://image.flaticon.com/icons/svg/34/34651.svg',
            scale: 0.1
          },
        });
        let tercera = new M.style.Point({
          icon: {
            src: 'https://image.flaticon.com/icons/svg/34/34654.svg',
            scale: 0.1
          },
        });
        let categoryStyle = new M.style.Category("categoria", {
          "Primera": primera,
          "Segunda": segunda,
          "Tercera": tercera
        });

        //Estilo para cluster
        let clusterOptions = {
          ranges: [{
            min: 2,
            max: 4,
            style: new M.style.Point({
              stroke: {
                color: '#5789aa'
              },
              fill: {
                color: '#99ccff',
              },
              radius: 20
            })
          }, {
            min: 5,
            max: 9,
            style: new M.style.Point({
              stroke: {
                color: '#5789aa'
              },
              fill: {
                color: '#3399ff',
              },
              radius: 30
            })
          }, {
            min: 10,
            max: 15,
            style: new M.style.Point({
              stroke: {
                color: '#5789aa'
              },
              fill: {
                color: '#004c99',
              },
              radius: 40
            })
          }],
          animated: true,
          hoverInteraction: true,
          displayAmount: true,
          distance: 80,
          maxFeaturesToSelect: 7
        };
        let vendorParameters = {
          distanceSelectFeatures: 25,
          convexHullStyle: {
            fill: {
              color: '#000000',
              opacity: 0.5
            },
            stroke: {
              color: '#000000',
              width: 1
            }
          }
        }
        let clusterStyle = new M.style.Cluster(clusterOptions, vendorParameters);
        campamentos.setStyle(clusterStyle);
    `, []);
  },
  'Compararmos BBOX y MaxExtent para dos capas WMS overlays': (browser) => {
    browser
      .waitForElementPresent('div#reservasLoaded')
      .pause(1000)
      .moveToElement('div#map', 100, 100)
      .pause(1000)
      .mouseButtonClick()
      .pause(500)
      .screenshot(undefined, ({ value }) => {
        const buf = Buffer.from(value, 'base64');
        getColors(buf, 'image/png').then((colors) => {
          const r = 223;
          const g = 115;
          const b = 255;
          colors.forEach((color) => {
            const [cr, cg, cb] = color.rgb();
            expect(Math.abs(cr - r)).to.be.lessThan(10);
            expect(Math.abs(cg - g)).to.be.lessThan(10);
            expect(Math.abs(cb - b)).to.be.lessThan(10);
          });
        });
      })
      .pause(1000)
      .end(() => server.close());
  },
};
