var mapajs = M.map({
  'container': 'map',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
});

var centros = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda_subtipo",
  legend: "centrosassda_subtipo",
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

let dia = new M.style.Point({
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
    scale: 1
  },
});

let dia_st2 = new M.style.Point({
  stroke: {
    color: '#fff351',
    width: 2
  },
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
    scale: 0.75
  },
  radius: 15,
  fill: {
    color: 'white',
    width: 15,
    opacity: 0
  }
});

let dia_st3 = new M.style.Point({
  stroke: {
    color: '#9b9126',
    width: 2
  },
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
    scale: 0.75
  },
  radius: 15,
  fill: {
    color: 'white',
    width: 15,
    opacity: 0
  }
});

let dia_st4 = new M.style.Point({
  stroke: {
    color: '#9b9126',
    width: 5
  },
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
    scale: 0.75
  },
  radius: 15,
  fill: {
    color: 'white',
    width: 15,
    opacity: 0
  }
});

let dia_st5 = new M.style.Point({
  stroke: {
    color: '#fff351',
    width: 5
  },
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/discapacidad_recursos.png',
    scale: 0.75
  },
  radius: 15,
  fill: {
    color: 'white',
    width: 15,
    opacity: 0
  }
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

let residencial_st2 = new M.style.Point({
  stroke: {
    color: '#00b964',
    width: 2
  },
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/infancia_recursos.png',
    scale: 0.75
  },
  radius: 15,
  fill: {
    color: 'white',
    width: 15,
    opacity: 0
  }
});

let residencial_st3 = new M.style.Point({
  stroke: {
    color: '#32ffdc',
    width: 2
  },
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/infancia_recursos.png',
    scale: 0.75
  },
  radius: 15,
  fill: {
    color: 'white',
    width: 15,
    opacity: 0
  }
});

let residencial_st4 = new M.style.Point({
  stroke: {
    color: '#32ffdc',
    width: 4
  },
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/infancia_recursos.png',
    scale: 0.75
  },
  radius: 15,
  fill: {
    color: 'white',
    width: 15,
    opacity: 0
  }
});

let residencial_st5 = new M.style.Point({
  stroke: {
    color: '#00b964',
    width: 5
  },
  icon: {
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/infancia_recursos.png',
    scale: 0.75
  },
  radius: 15,
  fill: {
    color: 'white',
    width: 15,
    opacity: 0
  }
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

let subtipologiaStyle = new M.style.Category("subtipologia", {
  "CENTRO DE DÍA": dia,
  "CENTRO DE DÍA OCUPACIONAL": dia_st2,
  "CENTRO DE DÍA PARA PERSONAS CON AUTISMO": dia_st3,
  "CENTRO DE DÍA PARA PERSONAS CON DAÑO CEREBRAL": dia_st2,
  "CENTRO DE DÍA PARA PERSONAS CON DISCAPACIDAD FÍSICA": dia_st3,
  "CENTRO DE DÍA PARA PERSONAS CON PARÁLISIS CEREBRAL": dia_st2,
  "CENTRO DE DÍA PARA PERSONAS CON TRASTORNOS DE CONDUCTA": dia_st4,
  "CENTRO DE ENCUENTRO Y ACOGIDA": dia_st5,
  "CENTRO DE TRATAMIENTO AMBULATORIO": dia_st4,
  "CENTRO DE TRATAMIENTO AMBULATORIO DE ATENCIÓN EXCLUSIVA AL JUEGO PATOLÓGICO": dia_st5,
  "CENTRO DE NOCHE": noche,
  "CENTRO DE PARTICIPACIÓN ACTIVA DE PERSONAS MAYORES": mayores,
  "CENTRO DE SERVICIOS SOCIALES COMUNITARIOS": sociales,
  "ALBERGUES PARA PERSONAS TRABAJADORAS TEMPORERAS": residencial,
  "CASA": residencial_st3,
  "CASA DE ACOGIDA": residencial_st2,
  "CASA DE EMERGENCIA": residencial_st3,
  "CASA HOGAR": residencial_st2,
  "CENTRO DE ACOGIDA": residencial_st3,
  "CENTRO DE DESINTOXICACIÓN RESIDENCIAL": residencial_st2,
  "CENTRO RESIDENCIAL": residencial_st3,
  "COMUNIDAD TERAPÉUTICA": residencial_st4,
  "PISO TUTELADO": residencial_st5,
  "RESIDENCIA": residencial_st4,
  "RESIDENCIA DE PERSONAS CON AUTISMO": residencial_st5,
  "RESIDENCIA DE PERSONAS CON DISCAPACIDAD": residencial_st4,
  "RESIDENCIA DE PERSONAS CON DISCAPACIDAD FÍSICA": residencial_st5,
  "RESIDENCIA DE PERSONAS CON DISCAPACIDAD INTELECTUAL Y TRASTORNOS DE CONDUCTA": residencial_st4,
  "RESIDENCIA DE PERSONAS CON PARÁLISIS CEREBRAL": residencial_st5,
  "RESIDENCIA PARA PERSONAS ADULTAS (RA)": residencial_st2,
  "RESIDENCIA PARA PERSONAS MAYORES AUTÓNOMAS": residencial_st3,
  "RESIDENCIA PARA PERSONAS MAYORES CON TRASTORNOS DE CONDUCTA": residencial_st2,
  "RESIDENCIA PARA PERSONAS MAYORES EN SITUACIÓN DE DEPENDENCIA": residencial_st3,
  "VIVIENDA DE APOYO A LA REINSERCIÓN": residencial_st2,
  "VIVIENDA DE APOYO AL TRATAMIENTO": residencial_st3,
  "VIVIENDA SUPERVISADA": residencial_st2,
  "VIVIENDA TUTELADA": residencial_st3,
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
          color: '#5789aa',
          width: 10
        },
        fill: {
          color: '#1c5fa1',
          opacity: 0.9
        },
        radius: 40
      })
          }
        ],
  // animated: true,
  // hoverInteraction: true,
  // displayAmount: true,
  // selectedInteraction: true,
  // distance: 80
};

var vendorParameters = {
  displayInLayerSwitcherHoverLayer: false,
  distanceSelectFeatures: 15
}

let clusterStyle = new M.style.Cluster(options, vendorParameters);

centros.on(M.evt.LOAD, function() {
  centros.setStyle(subtipologiaStyle);
  centros.setStyle(clusterStyle);
});

centros.on(M.evt.SELECT_FEATURES, function(features) {
  features.forEach(function(feature) {
    //logFeature(feature);
    if (feature.getGeoJSON().properties.features) {
      //console.log('Es un cluster');
    }
    else {
      //console.log('Es un feature');
      // Creamos el html de la pestaña
      var fs = "<table width='500'>";
      var keys = Object.keys(feature.getGeoJSON().properties);
      //keys.remove("ogc_fid");
      keys.remove("concierto");
      keys.remove("xx");
      keys.remove("longitud");
      keys.remove("latitud");
      keys.remove("tipo");
      keys.forEach(function atributos(key) {
        if (feature.getAttribute(key) != "") {
          fs += '<tr><td>';
          fs += '\t<b>' + key + '</b>: ' + feature.getAttribute(key);
          fs += '</tr></td>';
        }
      });
      fs += '</table>';
      //console.log(fs);
      // Creamos un objeto tab
      var featureTabOpts = {
        'icon': 'g-cartografia-pin',
        'title': 'Información del Centro',
        'content': fs
      };
      // Creamos el Popup y le añadimos la pestaña
      popup = new M.Popup();
      popup.addTab(featureTabOpts);
      // Finalmente se añade al mapa, especificando las Coordenadas
      var coordenadas = feature.getGeometry().coordinates;
      //console.log(feature.getGeometry().coordinates);
      mapajs.addPopup(popup, coordenadas);

    }

  });
});

function toogleAnimate() {
  clusterStyle.setAnimated(!clusterStyle.isAnimated());
  let btn = document.getElementById("animateBtn");
  btn.innerText = btn.innerText.replace(/(true)|(false)$/i, '') + clusterStyle.isAnimated();
}
