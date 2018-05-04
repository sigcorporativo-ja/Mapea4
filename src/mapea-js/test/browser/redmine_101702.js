let map = M.map({
  container: 'map',
  controls: ['layerswitcher'],
  center: [235976.378383697, 4142035.537716032],
  label: 'label de prueba'
});
const geoJSON = new M.layer.GeoJSON({
  name: 'points',
  source: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.207275390625,
          38.06971703320484
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.6689453125,
          38.013476231041935
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.5810546875,
          37.243448378654115
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -4.89990234375,
          37.44433544620035
        ]
        }
    },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.2237548828125,
          37.23032838760387
        ]
        }
      },

      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.520385742187499,
          37.70120736474139
        ]
        }
    }
  ]
  }
}, {
  'style': new M.style.Point({
    'fill': {
      'color': 'red'
    },
    'stroke': {
      'color': '#fff',
      'width': 5
    },
    'radius': 10
  })
});
map.addLayers([geoJSON, 'KML*Arboleda*http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml*true']);

map.addPlugin(new M.plugin.Printer({
  "params": {
    "layout": {
      "outputFilename": "mapea_${yyyy-MM-dd_hhmmss}"
    },
    "pages": {
      "clientLogo": "http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif",
      "creditos": "Impresión generada a través de Mapea"
    }
  }
}, {
  "options": {
    "legend": "true"
  }
}))

// map.on(M.evt.COMPLETED, (evt) => {
setTimeout((evt) => {
  const control = map.getControls('layerswitcher')[0];
  const layer = map.getKML()[0];
  const feature = geoJSON.getFeatures()[0];
  const formatter = geoJSON.getImpl().formater_;
  const handler = map.featuresHandler_;
  const style = geoJSON.getStyle();
  const label = map.getLabel();
  const popup = label.getPopup();
  const plugin = map.getPlugins()[0];

  console.log('destroying control...');
  control.destroy();
  console.log('destroying layer...');
  layer.destroy();
  console.log('destroying feature...');
  feature.destroy();
  console.log('destroying formatter...');
  formatter.destroy();
  console.log('destroying handler...');
  handler.destroy();
  console.log('destroying style...');
  style.destroy();
  console.log('destroying popup...');
  popup.destroy();
  console.log('destroying label...');
  label.destroy();
  console.log('destroying plugin...');
  plugin.destroy();
  console.log('destroying map...');
  map.destroy();
}, 3000);

function destroyControl() {
  map.getControls()[0].destroy();
}

function destroyLayer() {
  map.getBaseLayers()[0].destroy();
}

function destroyMap() {
  map.destroy();
}
