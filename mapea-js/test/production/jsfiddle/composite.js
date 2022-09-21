let map = M.map({
  container: "map"
});

// Capa puntual de Campamentos
var campamentos = new M.layer.GeoJSON({
  name: "Provincias",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=campamentos&outputFormat=application/json",
  extract: true
});

map.addLayers(campamentos);

// Estilo basico: puntos amarillos con borde rojo
let estilo_base = new M.style.Point({
  radius: 5,
  fill: {
    color: 'yellow',
    opacity: 0.5
  },
  stroke: {
    color: '#FF0000'
  }
});

// Estilo cluster por defecto
let estilo_cluster = new M.style.Cluster();

// Cluster permite Composite, asi que se le agrega el
// estilo base
let composite = estilo_cluster.add(estilo_base);

// Y asignamos a la capa la composicion creada
campamentos.setStyle(composite);

// Podemos ver qué estilos tiene agregados el estilo_cluster
console.log('estilo_cluster tiene agregados los siguientes estilos:', estilo_cluster.getStyles());
