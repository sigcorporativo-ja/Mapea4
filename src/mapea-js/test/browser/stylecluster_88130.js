var mapajs = M.map({
  'container': 'map',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
});

var centros = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda_subtipo",
  legend: "cluster",
  getfeatureinfo: "plain",
  geometry: 'POINT',
  extract: true,
});

mapajs.addLayers(centros);

// CONFIGURACIÓN PARÁMETROS CLUSTER
var options = {
  ranges: [
    {
      min: 2,
      max: 3,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#a3c5d8',
          opacity: 0.2
        },
        radius: 20
      })
          },
    {
      min: 3,
      max: 5,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#6aa8da',
          opacity: 0.4
        },
        radius: 20
      })
          },
    {
      min: 5,
      max: 10,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#468cc4',
          opacity: 0.5
        },
        radius: 20
      })
          },
    {
      min: 10,
      max: 15,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#2160a6',
          opacity: 0.7
        },
        radius: 20
      })
          },
    {
      min: 15,
      max: 20,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#1c5fa1',
          opacity: 0.7
        },
        radius: 20
      })
          },
    {
      min: 20,
      max: 50000,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa',
          width: 10
        },
        fill: {
          color: '#1c5fa1',
          opacity: 0.9
        },
        radius: 40
      })
          }
        ],
  // animated: true,
  // hoverInteraction: true,
  // displayAmount: true,
  // selectedInteraction: true,
  // distance: 80
};

var vendorParameters = {
  displayInLayerSwitcherHoverLayer: false,
  distanceSelectFeatures: 15
}

let clusterStyle = new M.style.Cluster(options, vendorParameters);

centros.on(M.evt.LOAD, function() {
  // centros.setStyle(subtipologiaStyle);
  centros.setStyle(clusterStyle);
});

centros.on(M.evt.SELECT_FEATURES, function(features) {
  console.log(features);
  if (features.some(f => f.getGeoJSON().properties.features)) {
    M.dialog.error('Es un cluster');
  }
});
