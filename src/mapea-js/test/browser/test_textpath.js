const getRandom = () => Math.round(Math.random() * 100);

const initializeMap = () => {
  window.map = new M.map({
    container: 'map',
    projection: 'EPSG:4326*d',
    controls: ['layerswitcher'],
    layers: ['OSM']
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

  window.map.addLayers(ayuntamientos);


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


  // var centros = new M.layer.WFS({
  //   name: "Centros ASSDA",
  //   url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  //   namespace: "mapea",
  //   name: "centrosassda_subtipo",
  //   legend: "cluster",
  //   getfeatureinfo: "plain",
  //   geometry: 'POINT',
  //   extract: true,
  // });
  //
  // window.map.addLayers(centros);

  // centros.setStyle(new M.style.Chart({
  //   type: M.style.chart.types.PIE,
  //   radius: 15,
  //   offsetX: 0,
  //   offsetY: 0,
  //   scheme: M.style.chart.schemes.Classic,
  //   rotateWithView: true,
  //   stroke: {
  //     color: '#000',
  //     width: 2
  //   },
  //   variables: [{
  //     attribute: "cif_entidad",
  //     label: {
  //       text: "{{cif_entidad}}",
  //     },
  //     legend: 'sdafasdf'
  //   }, {
  //     attribute: "numreg_entidad",
  //     label: {
  //       text: "{{numreg_entidad}}",
  //     },
  //     legend: 'aaaaa'
  //   }]
  // }));

  provideGeoJSON(GeoJSONTypes.linestring).then((data) => {
    window.features = new M.format.GeoJSON().read(data, ol.proj.get('EPSG:4326'));

    features.map(feature => {
      feature.setAttribute('data', [getRandom(), getRandom(), getRandom(), getRandom()]);
      feature.setAttribute('numX', getRandom());
      feature.setAttribute('numY', getRandom());
      feature.setAttribute('numZ', getRandom());
      return feature;
    })

    let geometryTypes = features
      .map(f => f.getImpl().getOLFeature().getGeometry().getType())
      .reduce((tot, curr, i) => {
        if (!(tot instanceof Array)) {
          tot = [tot];
        }
        return tot.indexOf(curr) === -1 ? tot.concat([curr]) : tot;
      });

    console.log('features', features);
    console.log('geometry types', geometryTypes)

    window.linesLayer = new M.layer.Vector();

    linesLayer.addFeatures(features);

    map.addLayers(linesLayer);
    map.setBbox(linesLayer.getFeaturesExtent());

    linesLayer.setStyle(new M.style.Line({
      fill: {
        color: '#CC33AA',
      },
      stroke: {
        color: 'blue',
        width: 2
      },
      label: {
        text: 'sample text',
        path: true
      }
    }));

  }, (error) => {
    console.log('error getting json', error)
  });
};

window.onload = initializeMap;
