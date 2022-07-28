let mapajs = M.map({
  container: "map",
  controls: ["layerswitcher"],
  wmcfiles: ["mapa"]
});

let distritosSan = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows",
  name: "distrito_sanitario",
  legend: "Distritos Sanitarios",
  geometry: 'POLYGON',
  ids: '28', //para probar más rápido
  extract: true
});

distritosSan.on(M.evt.LOAD, e => document.querySelector(".loading").style.display = 'none');



let stylePol = new M.style.Polygon({
  //Relleno del polígono
  fill: {
    //patrón de relleno
    pattern: {
      fill: {
        //color de relleno
        color: '#6A0888',
        //opacidad del relleno
        opacity: 0.5,

      },
      //pattern no puede cambiarse de color?
      //nombre del patron
      name: M.style.pattern.SQUARE,
      //tamaño del patrón
      size: 5,
      //escala del patrón
      scale: 1.3,
      spacing: 10,
      //rotación del patrón
      rotation: 20
      //SOLO ICONO:
      //si name=ICON
      /*'class': 'g-cartografia-save', 
      //si name=IMAGE
      'src': 'http://www.juntadeandalucia.es/prueba/icon.png',
      "offset": [21, 21],       
      "fill": {
        'color': '#fff',
        'opacity': 0.5
      }*/
    }
  },
  //línea del polígono
  stroke: {
    //color de la lína
    color: '#ff5588',
    //ancho de la línea
    width: 4,
    /*linedash: [10, 20],???
    linedashoffset: 0,
    linecap: 'square',
    linejoin: 'miter',
    miterlimit: 15*/
  },
  //etiqueta del polígono
  label: {
    //texto de la etiqueta: fijo, función o atributo
    text: '{{distrito}}',
    //fuente de la etiqueta
    font: 'bold italic 16px Courier New',
    //escala de la etiqueta
    scale: 0.9,
    //desplazamiento de la etiqueta en píxeles [x,y]
    offset: [10, 0],
    //color del texto
    color: '#000',
    //borde del texto
    stroke: {
      //color del borde
      color: '#FFF',
      //tamaño del borde
      width: 5,
      /*linedash: [1, 20], //????
      linedashoffset: 60,
      linecap: 'square',
      linejoin: 'miter',
      miterlimit: 15*/
    },
    rotate: false, //¿¿no hace nada??
    //rotación de la etiqueta
    rotation: 0.3,
    // Alineación horizontal respecto a la geometría
    // CENTER|LEFT|RIGHT
    align: M.style.align.CENTER,
    // Alineación vertical respecto a la etiqueta
    // TOP|BOTTOM|MIDDLE
    baseline: M.style.baseline.TOP
  }
});
distritosSan.setStyle(stylePol);

mapajs.addLayers(distritosSan);


// TODO: Activar el etiquetado cuando HOVER
