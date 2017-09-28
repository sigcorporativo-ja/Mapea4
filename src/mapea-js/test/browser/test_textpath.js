
const getRandom = () => Math.round(Math.random() * 100);

const initializeMap = () => {
  window.map = new M.map({
    container: 'map',
    projection: 'EPSG:4326*d',
    controls: ['layerswitcher'],
    layers: ['OSM']
  });

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
