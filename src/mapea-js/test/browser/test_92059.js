var mapajs = M.map({
  'container': 'map',
  // "layers": ['OSM'],
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline"]
});

var centros = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda",
  legend: "centrosassda",
  getfeatureinfo: "plain",
  geometry: 'POINT',
  extract: true,
});

mapajs.addLayers(centros);

let dia = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});

let noche = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/empleo_y_vivienda.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});

let mayores = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/administracion.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});

let sociales = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/gasolineras.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});

let residencial = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/infancia_recursos.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});

let social = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/icono_defecto.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});

let gitano = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/parking.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});

let comedor = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/mayores_recursos.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});

let consulta = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/interrogation.png',
    scale: 1,
    anchor: [0.5, 0.5]
  },
});



let categoryStyle = new M.style.Category("tipologia", {
  "CENTRO DE DÍA": dia,
  "CENTRO DE NOCHE": noche,
  "CENTRO DE PARTICIPACIÓN ACTIVA DE PERSONAS MAYORES": mayores,
  "CENTRO DE SERVICIOS SOCIALES COMUNITARIOS": sociales,
  "CENTRO RESIDENCIAL": residencial,
  "CENTRO SOCIAL": social,
  "CENTRO SOCIOCULTURAL GITANO": gitano,
  "COMEDOR": comedor,
  "CONSULTAR A LA COORDINACIÓN": consulta
});

centros.setStyle(categoryStyle);
centros.setStyle(new M.style.Cluster({
  maxFeaturesToSelect: 15
}, {
  distanceSelectFeatures: 30,
  convexHullStyle: {
    fill: {
      color: '#fff',
      opacity: 0.3
    },
    stroke: {
      color: '#1c5fa1',
      width: 1
    }
  }
}));

centros.on(M.evt.SELECT_FEATURES, (features, evt) => {
  let popupText;
  let f = features[0];
  if (f instanceof M.ClusteredFeature) {
    popupText = `${f.getAttribute("features").length} features </br>`;
    popupText += `Nº maximo de features a seleccionar: ${f.getAttribute("maxFeaturesToSelect")}</br>`;
    popupText += `Hover Interaction: ${f.getAttribute("hoverInteraction")}`;
  }
  else {
    popupText = f.getId();
  }
  mapajs.addLabel({
    text: popupText,
    coord: evt.coord
  });
});
centros.on(M.evt.UNSELECT_FEATURES, (features, evt) => {
  console.log('unselected!: ', features);
});
