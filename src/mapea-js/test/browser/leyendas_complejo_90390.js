var mapajs = M.map({
  'container': 'map',
  "layers": ['OSM'],
  "controls": ["layerswitcher"],
  "bbox": [-43166.92935192416, 3919989.3115265877, 690836.009087425, 4282698.3659015875]
});

var centros = new M.layer.WFS({
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda_subtipo",
  legend: "Centros ASSDA",
  getfeatureinfo: "plain",
  geometry: 'POINT',
  extract: true,
});

mapajs.addLayers(centros);


function applyCategory() {
  let verde = new M.style.Point({
    fill: {
      color: 'green'
    },
    stroke: {
      color: 'green',
      width: 1
    },
    radius: 13
  });
  let amarillo = new M.style.Point({
    fill: {
      color: 'yellow'
    },
    stroke: {
      color: 'yellow',
      width: 1
    },
    radius: 13
  });
  let rojo = new M.style.Point({
    fill: {
      color: 'red'
    },
    stroke: {
      color: 'red',
      width: 1
    },
    radius: 13
  });
  let azul = new M.style.Point({
    fill: {
      color: 'blue'
    },
    stroke: {
      color: 'blue',
      width: 1
    },
    radius: 13
  });

  let categoryStyle = new M.style.Category("tipologia", {
    "CENTRO DE DÍA": verde,
    "CENTRO DE NOCHE": rojo,
    "CENTRO DE PARTICIPACIÓN ACTIVA DE PERSONAS MAYORES": rojo,
    "CENTRO DE SERVICIOS SOCIALES COMUNITARIOS": rojo,
    "CENTRO RESIDENCIAL": amarillo,
    "CENTRO SOCIAL": azul,
    "CENTRO SOCIOCULTURAL GITANO": azul,
    "COMEDOR": azul,
    "CONSULTAR A LA COORDINACIÓN": azul
  });
  centros.setStyle(categoryStyle);
}

function applyCategoryIcons() {
  let dia = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
      scale: 1
    },
  });

  let noche = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/empleo_y_vivienda.png',
      scale: 1
    },
  });

  let mayores = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/administracion.png',
      scale: 1
    },
  });

  let sociales = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/centroeducativo.png',
      scale: 1
    },
  });

  let residencial = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/infancia_recursos.png',
      scale: 1
    },
  });

  let social = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/icono_defecto.png',
      scale: 1
    },
  });

  let gitano = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/parking.png',
      scale: 1
    },
  });

  let comedor = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/mayores_recursos.png',
      scale: 1
    },
  });

  let consulta = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/interrogation.png',
      scale: 1
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
}

function applyChoropleth() {
  let choroplethStyle = new M.style.Choropleth("numreg_entidad");
  centros.setStyle(choroplethStyle);
}

function applyChoroplethIcons() {
  let dia = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
      scale: 1
    },
  });

  let noche = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/empleo_y_vivienda.png',
      scale: 1
    },
  });

  let residencial = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/infancia_recursos.png',
      scale: 1
    },
  });

  let comedor = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/mayores_recursos.png',
      scale: 1
    },
  });

  let consulta = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/interrogation.png',
      scale: 1
    },
  });

  let choroplethStyle = new M.style.Choropleth("numreg_entidad", [residencial, dia, comedor, noche, consulta]);
  centros.setStyle(choroplethStyle);
}

function applyProportional() {
  let proportionalStyle = new M.style.Proportional("numreg_entidad", 10, 20);
  centros.setStyle(proportionalStyle);
}

function applyProportionalIcons() {
  let social = new M.style.Point({
    icon: {
      src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/icono_defecto.png',
      scale: 1
    },
  });
  let proportionalStyle = new M.style.Proportional("numreg_entidad", 10, 30, social);
  centros.setStyle(proportionalStyle);
}

function applyCluster() {
  let clusterStyle = new M.style.Cluster({
    ranges: []
  }, {
    distanceSelectFeatures: 15
  });
  centros.setStyle(clusterStyle);
}


function reset() {
  centros.setStyle(null);
}
