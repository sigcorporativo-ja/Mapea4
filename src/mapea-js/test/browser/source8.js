// constructor del mapa

/*
let mapajs = M.map({

  container: "map",

  projection: "EPSG:3857*m",

  layers: ["OSM"],

  /*center: {

    x: -5.9584180843195425,

    y: 37.36912689160224

  },

  zoom: 5,

  controls: ['layerswitcher', 'overviewmap', 'mouse'],

});

let points = new M.layer.GeoJSON({

  name: "Empresas",

  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/wfs?outputFormat=application/json&request=getfeature&typeNames=sepim:empresas&version=1.3.0",

  extract: false

});

points.on(M.evt.ADDED_LAYER, function() {

  alert("capa cargada");

});

mapajs.addLayers([points]);

var options = {
  ranges:

  [

    /*{min:1, max:1, style: new M.style.Point({

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

    {min:2, max:3, style: new M.style.Point({

      fill: {

        color: '#819FF7'

      },

      radius: 10

    })},

    {min:3, max:5, style: new M.style.Point({

      fill: {

        color: '#8181F7'

      },

      radius: 12

    })},

    {min:5, max:10, style: new M.style.Point({

      fill: {

        color: '#0000FF'

      },

      radius: 14

    })},

    {min:10, max:15, style: new M.style.Point({

      fill: {

        color: '#FF00BF'

      },

      radius: 16

    })},

    {min:15, max:20, style: new M.style.Point({

      fill: {

        color: '#FF0040'

      },

      radius: 18

    })},

    {min:20, max:50000, style: new M.style.Point({

      fill: {

        color: '#B40431'

      },

      radius: 20

    })}

  ],

  animated: true,

  hoverInteraction: true,

  displayAmount: true,

  selectedInteraction: true,

  distance: 80

};

var vendorParameters = {

  displayInLayerSwitcherHoverLayer: false,

  distanceSelectFeatures: 15

}

var style = new M.style.Cluster(options, vendorParameters);

points.setStyle(style);

let stylePoint = new M.style.Point({

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

});

*/

/*
M.proxy(true);
var mapajs = M.map({
  'container': 'mapjs',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline"],
});


let points = new M.layer.GeoJSON({
  name: "Empresas",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/wfs?outputFormat=application/json&request=getfeature&typeNames=sepim:empresas&version=1.3.0",
  extract: false
});

mapajs.addLayers([points]);

var options = {
  ranges: [


    {
      min: 2,
      max: 3,
      style: new M.style.Point({
        fill: {
          color: 'blue'
        },
        radius: 5
      })
    },
    {
      min: 3,
      max: 5,
      style: new M.style.Point({
        fill: {
          color: 'orange'
        },
        radius: 5
      })
    },
    {
      min: 5,
      max: 10,
      style: new M.style.Point({
        fill: {
          color: 'orange'
        },
        radius: 5
      })
    },
    {
      min: 10,
      max: 15,
      style: new M.style.Point({
        fill: {
          color: 'orange'
        },
        radius: 5
      })
    },
    {
      min: 15,
      max: 20,
      style: new M.style.Point({
        fill: {
          color: 'orange'
        },
        radius: 5
      })
    }

  ],
  animated: true
};

var vendorParameters = {
  hoverInteraction: true,
  displayAmount: true,
  displayInLayerSwitcherHoverLayer: false,
  selectedInteraction: true
}


points.setStyle(new M.style.Cluster(options, vendorParameters));

*/


let mapajs = M.map({

  container: "mapjs",

  projection: "EPSG:3857*m",

  layers: ["OSM"],

  /*center: {

    x: -5.9584180843195425,

    y: 37.36912689160224

  },

  zoom: 5,*/

  controls: ['layerswitcher', 'overviewmap', 'mouse'],

});

let points = new M.layer.GeoJSON({

  name: "Empresas",

  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/wfs?outputFormat=application/json&request=getfeature&typeNames=sepim:empresas&version=1.3.0",

  extract: false

});

points.on(M.evt.ADDED_LAYER, function() {

  alert("capa cargada");

});

mapajs.addLayers([points]);

var options = {
  ranges:

    [

      /*{min:1, max:1, style: new M.style.Point({

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

      {min:2, max:3, style: new M.style.Point({

        fill: {

          color: '#819FF7'

        },

        radius: 10

      })},

      {min:3, max:5, style: new M.style.Point({

        fill: {

          color: '#8181F7'

        },

        radius: 12

      })},

      {min:5, max:10, style: new M.style.Point({

        fill: {

          color: '#0000FF'

        },

        radius: 14

      })},

      {min:10, max:15, style: new M.style.Point({

        fill: {

          color: '#FF00BF'

        },

        radius: 16

      })},

      {min:15, max:20, style: new M.style.Point({

        fill: {

          color: '#FF0040'

        },

        radius: 18

      })},

      {min:20, max:50000, style: new M.style.Point({

        fill: {

          color: '#B40431'

        },

        radius: 20

      })}*/

    ],

  animated: true,

  hoverInteraction: true,

  displayAmount: true,

  selectedInteraction: true,

  distance: 80

};

var vendorParameters = {

  displayInLayerSwitcherHoverLayer: false,

  distanceSelectFeatures: 15

}

var style = new M.style.Cluster(options, vendorParameters);

points.setStyle(style);

let stylePoint = new M.style.Point({

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

});
