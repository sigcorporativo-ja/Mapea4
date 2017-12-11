function openPanel() {
  if (document.getElementById("PanelTipologia").className.indexOf("openPanel") >= 0) {
    document.getElementById("PanelTipologia").classList.remove("openPanel");
    document.getElementById("PanelTipologia").classList.add("closePanel");
  }
  else {
    document.getElementById("PanelTipologia").classList.add("openPanel");
    document.getElementById("PanelTipologia").classList.remove("closePanel");
  }
}

var mapajs = M.map({
  'container': 'map',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
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

let estiloSubtipoDefPink = new M.style.Point({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'red',
    width: 5
  },
  radius: 15
});



/// Preparación de estilos
let [scale, size, anchor, offset] = []
let dia = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
  },
});

let noche = new M.style.Point({
  icon: {
    // src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/empleo_y_vivienda.png',
    src: 'https://cdn3.iconfinder.com/data/icons/free-icons-3/128/cat_6.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
  },
});

let mayores = new M.style.Point({
  fill: {
    color: 'red'
  },
  radius: 8,
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/administracion.png',
    // src: 'https://cdn3.iconfinder.com/data/icons/free-icons-3/128/cat_6.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
  },
});

let sociales = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/gasolineras.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
  },
});

let residencial = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/infancia_recursos.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
  },
});

let social = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/icono_defecto.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
  },
});

let gitano = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/parking.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
  },
});

let comedor = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/mayores_recursos.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
  },
});

let consulta = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/interrogation.png',
    scale: scale,
    size: size,
    anchor: anchor,
    offset: offset
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
          color: '#5789aa'
        },
        fill: {
          color: '#1c5fa1',
          opacity: 0.9
        },
        radius: 40
      })
        }
    ],
  animated: false,
  hoverInteraction: true,
  displayAmount: true,
  selectInteraction: true,
  maxFeaturesToSelect: 100,
  distance: 80
};

var vendorParameters = {
  displayInLayerSwitcherHoverLayer: false,
  distanceSelectFeatures: 120,
  animationDuration: 0.1,
  animationMethod: 'linear',
  convexHullStyle: {
    fill: {
      color: 'orange',
      opacity: 0.5
    },
    stroke: {
      color: 'blue',
      width: 2
    },
    label: {
      color: 'white'
    }

  }
}


centros.setStyle(categoryStyle);
centros.setStyle(new M.style.Cluster(options, vendorParameters));
