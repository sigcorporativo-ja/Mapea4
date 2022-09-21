    var mapajs = M.map({
      container: 'map',
      controls: ["layerswitcher"]
    });

    var campamentos = new M.layer.WFS({
      legend: "Campamentos",
      url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs",
      namespace: "sepim",
      name: "campamentos",
      geometry: 'POINT',
      extract: true
    });
    mapajs.addLayers(campamentos);

    campamentos.on(M.evt.SELECT_FEATURES, function(features, evt) {
      if (features[0] instanceof M.ClusteredFeature) {
        console.log('Es un cluster:', features[0].getAttribute('features'));
      } else {
        console.log('NO es un cluster:', features);
      }
    });

    //Estilos para categorización
    let primera = new M.style.Point({
      icon: {
        src: 'https://ws058.juntadeandalucia.es/geoserver/styles/geoportal-cips/iconos/personas_victimas_genero/centroresidencial_vg.png',
        scale: 0.5
      },
    });
    let segunda = new M.style.Point({
      icon: {
        src: 'https://ws058.juntadeandalucia.es/geoserver/styles/geoportal-cips/iconos/sistema_de_proteccion_menores/centrodia_menores.png',
        scale: 0.5
      },
    });
    let tercera = new M.style.Point({
      icon: {
        src: 'https://ws058.juntadeandalucia.es/geoserver/styles/geoportal-cips/iconos/personas_con_enfermedad_mental/centroresidencial_em.png',
        scale: 0.5
      },
    });
    let categoryStyle = new M.style.Category("categoria", {
      "Primera": primera,
      "Segunda": segunda,
      "Tercera": tercera
    });

    //Estilo para cluster
    let clusterOptions = {
      ranges: [{
        min: 2,
        max: 4,
        style: new M.style.Point({
          stroke: {
            color: '#5789aa'
          },
          fill: {
            color: '#99ccff',
          },
          radius: 20
        })
      }, {
        min: 5,
        max: 9,
        style: new M.style.Point({
          stroke: {
            color: '#5789aa'
          },
          fill: {
            color: '#3399ff',
          },
          radius: 30
        })
      }, {
        min: 10,
        max: 15,
        style: new M.style.Point({
          stroke: {
            color: '#5789aa'
          },
          fill: {
            color: '#004c99',
          },
          radius: 40
        })
      }],
      animated: true,
      hoverInteraction: true,
      displayAmount: true,
      distance: 80,
      maxFeaturesToSelect: 7
    };
    let vendorParameters = {
      distanceSelectFeatures: 25,
      convexHullStyle: {
        fill: {
          color: '#000000',
          opacity: 0.5
        },
        stroke: {
          color: '#000000',
          width: 1
        }
      }
    }
    let clusterStyle = new M.style.Cluster(clusterOptions, vendorParameters);


    function setStyleCat() {
      campamentos.setStyle(categoryStyle);
    }

    function setStyleCluster() {
      campamentos.setStyle(clusterStyle);
    }

    campamentos.setStyle(clusterStyle);
