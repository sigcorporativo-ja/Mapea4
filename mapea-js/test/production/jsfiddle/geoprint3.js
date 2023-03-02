
var mapajs = M.map({
  container: "map",
  wmcfiles: ["cdau"],
  controls: ["layerswitcher"]
});


M.config('geoprint2', {
  'URL': "http://geoprint-sigc.juntadeandalucia.es/geoprint3/print/SIGC",
  'URL_APPLICATION': "http://geoprint-sigc.juntadeandalucia.es/geoprint3",
});


let mp = new M.plugin.Printer({
  params: {
    layout: {
      outputFilename: "mapea_${yyyy-MM-dd_hhmmss}"
    }
  },
   options: {
    layout: 'Imagen apaisada',
    format: 'pdf',
    dpi: 120
  }
});

mapajs.addPlugin(mp);