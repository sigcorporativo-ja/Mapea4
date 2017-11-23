let mapajs = M.map({
  container: "mapjs",
  controls: ['mouse', 'panzoom'],
  layers: [new M.layer.WMTS({
    name: 'OI.OrthoimageCoverage',
    url: 'http://www.ign.es/wmts/pnoa-ma?',
    transparent: false
  })],
  center: [349263.25512111955, 4141987.7282213746],
  zoom: 4,
  projection: 'EPSG:25830*m'
});


let layer = new M.layer.WFS({
  name: "Municipios",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "da_municipio_pol",
  legend: "Municipios - Plantilla Símbolo",
  getfeatureinfo: "plain",
  geometry: 'POLYGON',
  extract: true
});

mapajs.addLayers([layer]);

let incognita = new M.style.Polygon({
  fill: {
    color: 'green',
    opacity: 0.8
  },
  stroke: {
    color: 'black',
    width: 1
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});

layer.on(M.evt.LOAD, function() {
  layer.setStyle(incognita);

})

// Juego
let yavistos = new M.style.Polygon({
  fill: {
    color: 'orange',
    opacity: 0.5
  },
  stroke: {
    color: 'black',
    width: 1
  },
  label: {
    text: function(feature) {
      return (feature.getAttribute('nombre'))
    },
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});
let seleccionado = new M.style.Polygon({
  fill: {
    color: 'yellow',
    opacity: 0.5
  },
  stroke: {
    color: 'black',
    width: 1
  },
  label: {
    text: function(feature) {
      return (feature.getAttribute('nombre'))
    },
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});

// version que no oculta los ya seleccionados
var anteriores = [];

layer.on(M.evt.SELECT_FEATURES,
  function(features) {
    layer.redraw();
    anteriores.forEach(function(feat) {
      feat.setStyle(yavistos);
    });
    //console.log(feature);

    features[0].setStyle(seleccionado);
    anteriores.push(features[0]);
  });


function resetea() {
  anteriores = [];
  layer.setStyle(incognita);
  layer.redraw();
}


// Colores para categorizar
let verdep = new M.style.Polygon({
  fill: {
    color: 'green',
  },
  stroke: {
    color: '"black"',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});


let amarillop = new M.style.Polygon({
  fill: {
    color: 'pink',
  },
  stroke: {
    color: '"black"',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});

let rojop = new M.style.Polygon({
  fill: {
    color: 'red',
  },
  stroke: {
    color: '"black"',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});


let azulp = new M.style.Polygon({
  fill: {
    color: 'grey',
  },
  stroke: {
    color: '"black"',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});

let naranjap = new M.style.Polygon({
  fill: {
    color: 'orange',
  },
  stroke: {
    color: '"black"',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});

let marronp = new M.style.Polygon({
  fill: {
    color: 'brown',
  },
  stroke: {
    color: '"black"',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});

let magentap = new M.style.Polygon({
  fill: {
    color: '#e814d9',
  },
  stroke: {
    color: '"black"',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});

let moradop = new M.style.Polygon({
  fill: {
    color: '#b213dd',
  },
  stroke: {
    color: '"black"',
  },
  label: {
    text: '?',
    color: 'black',
    stroke: {
      'color': '#E5FFCC',
      'width': 3
    }
  }
});

let categoryStylep = new M.style.Category("nom_provincia", {
  "ALMERIA": marronp,
  "CADIZ": amarillop,
  "CORDOBA": magentap,
  "GRANADA": verdep,
  "JAEN": naranjap,
  "MALAGA": azulp,
  "SEVILLA": rojop,
  "HUELVA": moradop
});

function categoryStyle() {
  layer.setStyle(categoryStylep);
  anteriores.forEach(function(feat) {
    feat.setStyle(yavistos);
  });
}
