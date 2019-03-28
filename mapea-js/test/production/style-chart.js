// En el constructor
var mapajs = M.map({
  container: "map",
  controls: ["layerswitcher"],
  wmcfiles: ["cdau"]
});

// Con metodos
var layer = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs?",
  namespace: "tematicos",
  name: "provincias_pob_centroides",
  legend: "Provincias",
  geometry: 'POINT'
});

mapajs.addWFS(layer);

let stylechart = new M.style.Chart({
  type: 'bar',
  donutRatio: 0.5,
  radius: 25,
  //offsetX: 0,
  // offsetY: 0,
  stroke: {
    color: 'black',
    width: 1
  },
  //  animation: true,
  scheme: M.style.chart.schemes.Custom,
  // rotateWithView: true,
  // fill3DColor: '#CC33DD',
  variables: [{
    attribute: 'd0_15_es',
    legend: '0-15 años',
    fill: '#F2F2F2',
    label: {
      stroke: {
        color: 'white',
        width: 2
      },
      radiusIncrement: 10,
      fill: 'black',
      text: function(value, values, feature) {
        return value.toString();
      },
      font: 'Comic Sans MS',
      //scale: 1.25
    }
  }, {
    attribute: 'd16_45_es',
    legend: '16-45 años',
    fill: 'blue',
    label: {
      text: function(value, values, feature) {
        return value.toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#fff',
        width: 2
      },
      fill: 'blue',
      font: 'Comic Sans MS',
      //scale: 1.25
    }
  }, {
    attribute: 'd45_65_es',
    legend: '45-65 años',
    fill: 'pink',
    label: {
      text: function(value, values, feature) {
        // return new String(value).toString();
        return value.toString();
      },
      //radiusIncrement: 10,
      stroke: {
        color: '#fff',
        width: 2
      },
      fill: 'red',
      font: 'Comic Sans MS',
      //scale: 1.25
    }
  }, {
    attribute: 'd65_es',
    legend: '65 años o más',
    fill: 'orange',
    label: {
      text: function(value, values, feature) {
        return value.toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#fff',
        width: 2
      },
      fill: '#886A08',
      font: 'Comic Sans MS',
      //scale: 1.25
    }
  }]
});

layer.setStyle(stylechart);
