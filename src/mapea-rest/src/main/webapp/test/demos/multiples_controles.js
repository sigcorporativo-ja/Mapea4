let mapaWMTS = new M.layer.WMTS({
  name: "MTN",
  legend: "Mapa",
  url: "http://www.ign.es/wmts/mapa-raster?",
  transparent: false
});

let mapajs = M.map({
    "controls": ["mouse", "panzoombar", "panzoom", "navtoolbar", "layerswitcher", "overviewmap", "scale", "scaleline", "location"],
    "container": "mapjs",
    "layers": [mapaWMTS, "KML*Arboleda*http://clientes.guadaltel.es/desarrollo/mapea/Componente/kml/*arbda_sing_se.kml*true"],
    "getfeatureinfo": "html",
    projection: 'EPSG:25830*m',
    center: [327829.1660345335, 4133007.047783969],
    zoom: 4
  })
  .addPlugin(new M.plugin.Geosearchbylocation({}))
  .addPlugin(new M.plugin.Geosearch({
    "core": "sigc",
    "url": "http://geobusquedas-sigc.juntadeandalucia.es/",
    "handler": "/search"
  }))
  .addPlugin(new M.plugin.Printer({
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
  }))
  .addPlugin(new M.plugin.Measurebar())
  .addPlugin(new M.plugin.Streetview());
