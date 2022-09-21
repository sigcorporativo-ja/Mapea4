let lyProv = new M.layer.WFS({
  name: "Provincias",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wfs?",
  legend: "Provincias - COROPLETAS",
  geometry: 'POLYGON',
});

function aplicar() {
  let colorInicial = document.getElementById("firstColor").value;
  let colorFinal = document.getElementById("lastColor").value;
  let breaks = document.getElementById("breaks").value;
  let quantification = document.getElementById("JENKS").checked ? new M.style.quantification.JENKS(breaks) : new M.style.quantification.QUANTILE(breaks);
  let choropleth = new M.style.Choropleth(valueField, [colorInicial, colorFinal], quantification);
  layer.setStyle(choropleth);
}

let mapajs = M.map({
  container: 'map',
  controls: ["layerswitcher"],
  wmcfiles: ["mapa"]
});

let valueField = "u_cod_prov";
let layer = lyProv;
mapajs.addLayers(layer);
aplicar();
