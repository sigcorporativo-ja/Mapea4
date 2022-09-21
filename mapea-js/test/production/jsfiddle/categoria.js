var mapajs = M.map({
  container: 'map',
  controls: ["layerswitcher", "mouse", "scale", /* "overviewmap",*/ "panzoombar", "scaleline"],
  wmcfiles: ["mapa"]
});

// Capa de municipios
let layer = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "ind_mun_simp",
  legend: "Municipios SIM",
  geometry: 'MPOLYGON'
});

mapajs.addLayers([layer]);

// Colores para categorizar
let verdep = new M.style.Polygon({
  fill: {
    color: 'green',
  },
  stroke: {
    color: '"black"',
  }
});

let amarillop = new M.style.Polygon({
  fill: {
    color: 'pink',
  },
  stroke: {
    color: '"black"',
  }
});

let rojop = new M.style.Polygon({
  fill: {
    color: 'red',
  },
  stroke: {
    color: '"black"',
  }
});

let azulp = new M.style.Polygon({
  fill: {
    color: 'grey',
  },
  stroke: {
    color: '"black"',
  }
});

let naranjap = new M.style.Polygon({
  fill: {
    color: 'orange',
  },
  stroke: {
    color: '"black"',
  }
});

let marronp = new M.style.Polygon({
  fill: {
    color: 'brown',
  },
  stroke: {
    color: '"black"',
  }
});

let magentap = new M.style.Polygon({
  fill: {
    color: '#e814d9',
  },
  stroke: {
    color: '"black"',
  }
});

let moradop = new M.style.Polygon({
  fill: {
    color: '#b213dd',
  },
  stroke: {
    color: '"black"',
  }
});

// Se definen las relaciones valor-estilos
let categoryStylep = new M.style.Category("provincia", {
  "Almería": marronp,
  "Cádiz": amarillop,
  "Córdoba": magentap,
  "Granada": verdep,
  "Jaén": naranjap,
  "Málaga": azulp,
  "Sevilla": rojop,
  "Huelva": moradop
});

// Asignamos el estilo a la capa
layer.setStyle(categoryStylep);
