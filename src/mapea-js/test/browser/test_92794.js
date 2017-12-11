var mapajs = M.map({
  'container': 'map',
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

centros.on(M.evt.HOVER_FEATURES, (features, evt) => {
  let f = features[0];
  let Mfeatures = [];
  if (f instanceof M.ClusteredFeature) {
    Mfeatures = f.getAttribute("features");
  }
  else {
    Mfeatures = features;
  }

  Mfeatures.forEach(function(feature) {
    console.log('style: ', feature.getStyle());
  });
});

centros.on(M.evt.SELECT_FEATURES, (features, evt) => {
  console.log('SELECCION');
  let popupText;
  //console.log('features);
  let f = features[0];
  let Mfeatures = [];
  if (f instanceof M.ClusteredFeature) {
    console.log('Es un cluster: ', f);
    Mfeatures = f.getAttribute("features");
    console.log('Y contiene: ', Mfeatures);
  }
  else {
    Mfeatures = features;
  }

  /*if (mapajs.getPopup() != null) {
    mapajs.getPopup().destroy();
    //mapajs.addPopup(popup, [evt.coord[0], evt.coord[1]]);
  }*/
  let popup = new M.Popup();

  Mfeatures.forEach(function(feature) {
    console.log('Es un feature');
    // Creamos el html de la pestaña
    var fs = "<table width='500'>";
    var keys = Object.keys(feature.getGeoJSON().properties);
    keys.remove("ogc_fid");
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
    // Añadimos la pestaña
    popup.addTab(featureTabOpts);

    console.log('style: ', feature.getStyle());
  });

  /* mapajs.addLabel({
     text: popupText,
     coord: evt.coord
   });*/
  setTimeout(function() {
    mapajs.addPopup(popup, [evt.coord[0], evt.coord[1]]);
  }, 500);

});
/*centros.on(M.evt.UNSELECT_FEATURES, (features, evt) => {
  console.log('unselected!: ', features);
  mapajs.removePopup();
  console.log('Popup eliminado:', mapajs.getPopup());
});*/
