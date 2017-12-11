let map = M.map({
  container: 'map',
  controls: ['layerswitcher']
});

var centros = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda",
  legend: "centrosassda",
  geometry: 'POINT',
});

map.addLayers(centros);

let categories = {
  "MAYORES": new M.style.Point({
    fill: {
      color: 'red'
    },
    radius: 8
  }),
  "DISCAPACIDAD": new M.style.Point({
    fill: {
      color: 'yellow'
    },
    radius: 12
  }),
  "other": new M.style.Point({
    fill: {
      color: 'black'
    },
    stroke: {
      color: 'white'
    },
    radius: 10
  })
}

let style = new M.style.Category("sector", categories);
centros.setStyle(style);
