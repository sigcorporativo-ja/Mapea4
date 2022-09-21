var mapajs = M.map({
  container: "map",
  controls: ["layerswitcher"],
  wmcfiles: ["mapa"],
  center: [235661, 4139173],
  zoom: 8
});

var gasoductos = new M.layer.WFS({
  url: "http://www.ideandalucia.es/dea100/wfs?",
  name: "dea100:ie03_gasoducto",
  legend: "Gasoductos",
  geometry: 'MLINE',
  extract: true
});

let estiloLinea = new M.style.Generic({
  line: {
    // borde de la linea
    'stroke': {
      // color del borde
      color: 'black',
      // grosor del borde en pixeles
      width: 5,
      linedash: [2, 2, 10],
      //linedashoffset: 20,
      //linecap: 'round',
      //linejoin: 'miter',
      //miterlimit: 15
    },
    // Relleno de la linea
    'fill': {
      color: 'yellow',
      width: 3,
      opacity: 1,
    },
    'label': {
      text: function(feature) {
        return stringDivider(feature.getAttribute('nombre'), 16, '\n');
      },
      font: 'bold italic 12px Comic Sans MS',
      rotate: false,
      scale: 1,
      offset: [0, 0],
      color: '#ffffff',
      stroke: {
        color: '#000000',
        width: 5,
        //linedash: [1, 5],
        //linedashoffset: 5,
        //linecap: 'square',
        //linejoin: 'miter',
        //miterlimit: 15
      },
      rotate: false,
      rotation: 0.7,
      align: M.style.align.LEFT,
      baseline: M.style.baseline.TOP,
      //textoverflow: 'hidden',
      //minwidth: 10,
      //path: true
    }
  }
});

gasoductos.setStyle(estiloLinea);

mapajs.addLayers(gasoductos);

//https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
function stringDivider(str, width, spaceReplacer) {
  if (str.length > width) {
    var p = width;
    while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
      p--;
    }
    if (p > 0) {
      var left;
      if (str.substring(p, p + 1) == '-') {
        left = str.substring(0, p + 1);
      } else {
        left = str.substring(0, p);
      }
      var right = str.substring(p + 1);
      return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
    }
  }
  return str;
}
