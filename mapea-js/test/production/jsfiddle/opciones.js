var mapajs = M.map({
  container: "map",
  layers: ["WMS*MTA*http://www.ideandalucia.es/wms/mta400r_2008?*MTA400*true"],
  controls: ["mouse", "layerswitcher"]
});

/** Zoom **/
function hacerZoom() {
  mapajs.setZoom(6);
}

/** Bbox **/
function setCobertura() {
  mapajs.setBbox([323020, 4126873, 374759, 4152013]);
}

/** MaxExtent **/
function setMaxCobertura() {
  mapajs.setMaxExtent([323020, 4126873, 374759, 4152013]);
}

/** Projection **/
function setProyeccion() {
  mapajs.setProjection("EPSG:4326*d");
}

/** Center **/
function setCentro() {
  //modo objeto
  mapajs.setCenter({
    x: 211000,
    y: 4040000,
    draw: true
  });
  //modo cadena
  //mapajs.setCenter("211000,4040000*true");
}

/** Etiqueta **/
function addEtiqueta() {
  mapajs.addLabel("texto <b>con html</b>", [211000, 4040000]);
  //mapajs.addLabel("texto <b>con html</b>"); //se añade en el centro establecido
}
