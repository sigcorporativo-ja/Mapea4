window.mapajs = M.map({
  "controls": ["mouse", "panzoombar", "panzoom", "navtoolbar", "layerswitcher", "overviewmap", "scale", "scaleline", "location"],
  "container": "map",
  "layers": ["WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas*true", "WMTS*http://www.ideandalucia.es/geowebcache/service/wmts?*toporaster"],
  "getfeatureinfo": "html"
});
