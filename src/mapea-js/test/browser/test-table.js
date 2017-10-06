// TEST
// Prueba filtro por CQL contra el servicio WFS



let mapajs = M.map({
  container: "map",
  wmcfile: "callejero",
  controls: ["layerswitcher", "panzoombar"],
  zoom: 1
});

var lyProvincias = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Provincias",
  geometry: 'MPOLYGON'
});

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


lyProvincias.setStyle(new M.style.Polygon({
  fill: {
    color: 'blue',
    opacity: 0.3
  }
}));

mapajs.addLayers(lyProvincias);

function filtrar(ciudad) {
  lyProvincias.setCQL(`nombre='${ciudad}'`);
}
