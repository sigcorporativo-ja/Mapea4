// constructor del mapa
let mapajs = M.map({
  container: "map",
  projection: "EPSG:4326*d",
  layers: ["OSM"],
  center: {
    x: -5.9584180843195425,
    y: 37.36912689160224
  },
  zoom: 5,
  controls: ['layerswitcher', 'overviewmap', 'mouse'],
});

var options = {ranges:
  [
  /*{min:1, max:1, style: new M.style.Point({
      fill: {
        color: 'red'
      },
      radius: 15
    })},*/
    {min:2, max:3, style: new M.style.Point({
      fill: {
        color: 'blue'
      },
      radius: 5
    })},
    {min:3, max:5, style: new M.style.Point({
      fill: {
        color: 'orange'
      },
      radius: 5
    })},
    {min:5, max:10, style: new M.style.Point({
      fill: {
        color: 'orange'
      },
      radius: 5
    })},
    {min:10, max:15, style: new M.style.Point({
      fill: {
        color: 'orange'
      },
      radius: 5
    })},
    {min:20, max:25, style: new M.style.Point({
      fill: {
        color: 'orange'
      },
      radius: 5
    })}
  ],
  animated: true
};

var vendorParameters = {
  hoverInteraction: true,
  displayAmount: true,
  displayInLayerSwitcher: false,
  selectedInteraction: true
}



let points = new M.layer.GeoJSON({
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
          -5.03173828125,
          38.762650338334154
        ]
        }
      },
      {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -4.24072265625,
          38.8824811975508
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.53173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.83173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.00173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.55173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -6.88173828125,
            38.762650338334154
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.63173828125,
          39.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.73173828125,
          39.332650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.83173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -5.93173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -6.13173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -7.03173828125,
          38.762650338334154
        ]
        }
      },
      {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -6.24072265625,
          38.8824811975508
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -7.53173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -7.83173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -7.63173828125,
          39.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -7.73173828125,
          39.332650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -7.83173828125,
          38.762650338334154
        ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -7.93173828125,
          38.762650338334154
        ]
        }
      }
    ]
  }
});

mapajs.addLayers([points]);
points.setStyle(new M.style.Cluster(options, vendorParameters));
/*
points.on(M.evt.SELECT_FEATURES, f => console.log('click capa', f));

let f = points.getFeatures()[4];
f.setStyle(new M.style.Point({
  fill: {
    color: 'red'
  },
  radius: 15
}));
f.setAttribute("vendor", {'mapea': {'click': () => console.log('click feature', f)}});
*/
