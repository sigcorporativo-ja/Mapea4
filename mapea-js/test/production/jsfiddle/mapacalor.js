    var map = M.map({
      container: 'map',
      controls: ["layerswitcher"]
    });


    let aguas_subterraneas = new M.layer.WFS({
      url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
      name: "tematicos",
      legend: 'Aguas provincias_pob',
      geometry: 'POINT'
    }, {
      getFeatureOutputFormat: 'geojson',
      describeFeatureTypeOutputFormat: 'geojson'
    });
    map.addLayers(aguas_subterraneas);
    let style = new M.style.Heatmap('Cota_msnm');
    aguas_subterraneas.setStyle(style);
