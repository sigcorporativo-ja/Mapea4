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
  controls: ['layerswitcher', 'overviewmap'],
});

var options = {ranges:
  [
    {min:0, max:1, style: new M.style.Point({
      fill: {
        color: 'red'
      },
      radius: 5,
      icon: {
        src: 'https://cdn3.iconfinder.com/data/icons/free-icons-3/128/cat_6.png',
        rotation: 0.5,
        scale: 0.5,
        opacity: 0.8,
        anchor: [0.5, 1.9],
        anchororigin: 'top-left',
        anchororigin: 'top-left',
        anchorxunits: 'fraction',
        anchoryunits: 'fraction',
        rotate: false,
        // offset: [10, 0],
        crossorigin: null,
        snaptopixel: true,
        offsetorigin: 'bottom-left',
        size: [150, 95]
      }
    })},
    {min:1, max:2, style: new M.style.Point({
      fill: {
        color: 'blue'
      },
      radius: 5,
      icon: {
        src: 'https://cdn3.iconfinder.com/data/icons/free-icons-3/128/cat_6.png',
        rotation: 0.5,
        scale: 0.5,
        opacity: 0.8,
        anchor: [0.5, 1.9],
        anchororigin: 'top-left',
        anchororigin: 'top-left',
        anchorxunits: 'fraction',
        anchoryunits: 'fraction',
        rotate: false,
        // offset: [10, 0],
        crossorigin: null,
        snaptopixel: true,
        offsetorigin: 'bottom-left',
        size: [150, 95]
      }
    })},
    {min:2, max:100, style: new M.style.Point({
      fill: {
        color: 'orange'
      },
      radius: 5,
      icon: {
        src: 'https://cdn3.iconfinder.com/data/icons/free-icons-3/128/cat_6.png',
        rotation: 0.5,
        scale: 0.5,
        opacity: 0.8,
        anchor: [0.5, 1.9],
        anchororigin: 'top-left',
        anchororigin: 'top-left',
        anchorxunits: 'fraction',
        anchoryunits: 'fraction',
        rotate: false,
        // offset: [10, 0],
        crossorigin: null,
        snaptopixel: true,
        offsetorigin: 'bottom-left',
        size: [150, 95]
      }
    })}
  ],
  animated: true
};



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
          -5.13173828125,
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
          -5.23173828125,
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
          -5.33173828125,
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
          -5.43173828125,
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
          -5.63173828125,
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
          -5.73173828125,
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
      }
    ]
  },
});

mapajs.addLayers([points]);
//puntos.setStyle(new M.style.Cluster(options));
