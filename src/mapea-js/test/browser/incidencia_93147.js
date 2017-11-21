let map = new M.map({
  container: 'map',
  controls: ['layerswitcher'],
});


var ayuntamientos = new M.layer.WFS({
  name: "assda_sv10_ayuntamiento_point_indicadores",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "assda_sv10_ayuntamiento_point_indicadores",
  legend: "Prestaciones - Ámbito municipal",
  getfeatureinfo: "plain",
  geometry: 'POINT',
  extract: true,
});

map.addLayers(ayuntamientos);


let optionsChart = {
  type: 'pie',
  donutRatio: 0.5,
  radius: 25,
  offsetX: 0,
  offsetY: 0,
  stroke: {
    color: 'white',
    width: 1
  },
  label: {
    text: '{{nombre}}',
    color: 'red',
    font: '14px Comic Sans MS',
    stroke: {
      width: 4,
      color: 'white'
    },
    baseline: M.style.baseline.BOTTOM,
    offset: [0, 55]
  },
  animation: true,
  scheme: M.style.chart.schemes.Custom,
  rotateWpieView: true,
  fill3DColor: '#CC33DD',
  variables: [{
    attribute: 's0303',
    legend: 'Prestaciones PEAP',
    fill: 'cyan',
    label: {
      text: function(value, values, feature) {
        return new String(value).toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#000',
        width: 2
      },
      fill: 'cyan',
      font: 'Comic Sans MS',
      scale: 1.25
    }
    }, {
    attribute: 's0304',
    legend: 'Prestaciones PECEF',
    fill: 'blue',
    label: {
      text: function(value, values, feature) {
        return new String(value).toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#000',
        width: 2
      },
      fill: 'cyan',
      font: 'Comic Sans MS',
      scale: 1.25
    }
    }, {
    attribute: 's0305',
    legend: 'Prestaciones PEVS',
    fill: 'pink',
    label: {
      text: function(value, values, feature) {
        return new String(value).toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#000',
        width: 2
      },
      fill: 'cyan',
      font: 'Comic Sans MS',
      scale: 1.25
    }
    }, {
    attribute: 's0306',
    legend: 'Prestaciones SAD',
    fill: 'red',
    label: {
      text: function(value, values, feature) {
        return new String(value).toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#000',
        width: 2
      },
      fill: 'cyan',
      font: 'Comic Sans MS',
      scale: 1.25
    }
    }, {
    attribute: 's0307',
    legend: 'Prestaciones SAR',

    fill: 'yellow',
    label: {
      text: function(value, values, feature) {
        return new String(value).toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#000',
        width: 2
      },
      fill: 'cyan',
      font: 'Comic Sans MS',
      scale: 1.25
    }
    }, {
    attribute: 's0308',
    legend: 'Prestaciones SAT',
    fill: 'orange',
    label: {
      text: function(value, values, feature) {
        return new String(value).toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#000',
        width: 2
      },
      fill: 'cyan',
      font: 'Comic Sans MS',
      scale: 1.25
    }
    }, {
    attribute: 's0309',
    legend: 'Prestaciones UED',
    fill: 'brown',
    label: {
      text: function(value, values, feature) {
        return new String(value).toString();
      },
      radiusIncrement: 10,
      stroke: {
        color: '#000',
        width: 2
      },
      fill: 'cyan',
      font: 'Comic Sans MS',
      scale: 1.25
    }
    }]
}

estadisticasPrestaciones = new M.style.Chart(optionsChart);


//// ayuntamientos.setStyle(estadisticasPrestaciones);
ayuntamientos.setStyle(estadisticasPrestaciones);
ayuntamientos.setStyle(new M.style.Cluster());
