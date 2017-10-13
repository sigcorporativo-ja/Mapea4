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



centros.on(M.evt.SELECT_FEATURES, function(features) {
  // features.forEach(function(feature) {
  //logFeature(feature);
  if (features.length > 1) {
    console.log('Es un cluster');
  }
  else {
    var fs = null;
    var featureTabOpts = null;
    feature = features[0];
    console.log(feature);
    // Creamos el html de la pestaña
    fs = "<table width='500'>";
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
    console.log(fs);
    // Creamos un objeto tab
    featureTabOpts = {
      'icon': 'g-cartografia-pin',
      'title': 'Información del Centro',
      'content': fs
    };
    // Creamos el Popup y le añadimos la pestaña
    let popup = null;
    popup = new M.Popup();
    popup.addTab(featureTabOpts);
    // Finalmente se añade al mapa, especificando las Coordenadas
    var coordenadas = feature.getGeometry().coordinates;
    //console.log(feature.getGeometry().coordinates);
    mapajs.addPopup(popup, coordenadas);

    //tipologiaFilter();
  }

  // });
})


mapajs.addLayers(centros);



mapajs.addPlugin(new M.plugin.AttributeTable());

mapajs.addPlugin(new M.plugin.Printer({
  "params": {
    "pages": {
      "clientLogo": "http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif",
      "creditos": "Impresión generada a través de Mapea"
    },
    "layout": {
      "outputFilename": "mapea_${yyyy-MM-dd_hhmmss}"
    }
  }
}, {
  "options": {
    "legend": "true"
  }
}));



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
    src: 'http://mapabienestarsocial.iass.es/wp-content/plugins/tfecom-maps/images/gasolineras.png',
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



// CONFIGURACIÓN PARÁMETROS CLUSTER

var options = {
  ranges: [
        /*{min:1, max:1, style: new M.style.Point({
            fill: {
              color: 'red'
            },
            radius: 15
          })},*/

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
  animated: true,
  hoverInteraction: true,
  displayAmount: true,
  selectInteraction: true,
  maxFeaturesToSelect: 10,
  distance: 80
};

var vendorParameters = {
  displayInLayerSwitcherHoverLayer: false,
  distanceSelectFeatures: 10,
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

// centros.on(M.evt.LOAD, function() {
centros.setStyle(new M.style.Cluster(options, vendorParameters)); //// });
// ********************* ///
// Métodos de filtros    ///


// Aplicar filtro en función de las tipologías seleccionadas, generadas a partir de la
// clasificación establecida
function tipologiaFilter() {
  // Recorrer los elementos activos en la lista para montar el filtro 'OR'
  // Ejemplo
  // let filter = M.filter.OR([M.filter.OR([filtroA, filtroB]), filtroC])
  // layer.setFilter(filter);

  /*centros.setStyle(categoryStyle);


  let filterEqual = M.filter.EQUAL("tipologia", "CENTRO DE DÍA");
  centros.setFilter(filterEqual);

	centros.setStyle(new M.style.Cluster(options, vendorParameters));*/

  let selected = document.querySelector("#PanelTipologia").querySelectorAll("[type=checkbox]:checked");
  let filter = [];
  selected.forEach(function(elem) {
    filter.push(M.filter.EQUAL('tipologia', elem.value));
  });
  centros.setFilter(M.filter.OR(filter));

  ////REV_CLUSTER        centros.setStyle(new M.style.Cluster(options, vendorParameters));
}


function removeFilter() {
  centros.removeFilter();
}




var tooltip = document.getElementById('tooltip');

var overlay = new ol.Overlay({
  element: tooltip,
  offset: [10, 0],
  positioning: 'bottom-left'
});
mapajs.getMapImpl().addOverlay(overlay);


function displayTooltip(evt) {
  var pixel = evt.pixel;
  var feature = mapajs.getMapImpl().forEachFeatureAtPixel(pixel, function(feature) {
    return feature;
  });
  tooltip.style.display = (!M.utils.isNullOrEmpty(feature) && !M.utils.isNullOrEmpty(feature.getProperties().features) && feature.getProperties().features.length == 1) ? '' : 'none';
  if (feature) {
    if (!M.utils.isNullOrEmpty(feature.getProperties().features) && feature.getProperties().features.length == 1) {
      overlay.setPosition(evt.coordinate);
      console.log(feature.getProperties());
      console.log(feature.getProperties().features);
      tooltip.innerHTML = feature.getProperties().features[0].getProperties().nombre_entidad;
    }
  }
};

mapajs.getMapImpl().on('pointermove', displayTooltip);

function changeLegend() {
  centros.setLegendURL("http://www.hellin.net/callejero/leyenda415.jpg");
}
