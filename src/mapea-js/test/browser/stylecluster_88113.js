var mapajs = M.map({
  'container': 'map',
  "layers": ['MAPBOX*mapbox.streets'],
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
});

var centros = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda_subtipo",
  legend: "cluster",
  getfeatureinfo: "plain",
  geometry: 'POINT',
  extract: true,
});

mapajs.addLayers(centros);

// CONFIGURACIÓN PARÁMETROS CLUSTER
var options = {
  ranges: [
    {
      min: 2,
      max: 3,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#a3c5d8',
          opacity: 0.2
        },
        radius: 20
      })
          },
    {
      min: 3,
      max: 5,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#6aa8da',
          opacity: 0.4
        },
        radius: 20
      })
          },
    {
      min: 5,
      max: 10,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#468cc4',
          opacity: 0.5
        },
        radius: 20
      })
          },
    {
      min: 10,
      max: 15,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#2160a6',
          opacity: 0.7
        },
        radius: 20
      })
          },
    {
      min: 15,
      max: 20,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#1c5fa1',
          opacity: 0.7
        },
        radius: 20
      })
          },
    {
      min: 20,
      max: 50000,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa',
          width: 10
        },
        fill: {
          color: '#1c5fa1',
          opacity: 0.9
        },
        radius: 40
      })
          }
        ]
};

var vendorParameters = {
  distanceSelectFeatures: 15
}

let clusterStyle = new M.style.Cluster(options, vendorParameters);

let verde = new M.style.Point({
  fill: {
    color: 'green'
  },
  stroke: {
    color: 'green',
    width: 1
  },
  radius: 13
});
let amarillo = new M.style.Point({
  fill: {
    color: 'yellow'
  },
  stroke: {
    color: 'yellow',
    width: 1
  },
  radius: 13
});
let rojo = new M.style.Point({
  fill: {
    color: 'red'
  },
  stroke: {
    color: 'red',
    width: 1
  },
  radius: 13
});
let azul = new M.style.Point({
  fill: {
    color: 'blue'
  },
  stroke: {
    color: 'blue',
    width: 1
  },
  radius: 13
});

let categoryStyle = new M.style.Category("tipologia", {
  "CENTRO DE DÍA": verde,
  "CENTRO DE NOCHE": rojo,
  "CENTRO DE PARTICIPACIÓN ACTIVA DE PERSONAS MAYORES": rojo,
  "CENTRO DE SERVICIOS SOCIALES COMUNITARIOS": rojo,
  "CENTRO RESIDENCIAL": amarillo,
  "CENTRO SOCIAL": azul,
  "CENTRO SOCIOCULTURAL GITANO": azul,
  "COMEDOR": azul,
  "CONSULTAR A LA COORDINACIÓN": azul
});



function estableceCluster() {
  centros.setStyle(clusterStyle);
}

function estableceCategoria() {
  centros.setStyle(categoryStyle);
}

function estableceClusterCategory() {
  centros.setStyle(clusterStyle);
  centros.setStyle(categoryStyle);
}

function estableceCategoryCluster() {
  centros.setStyle(categoryStyle);
  centros.setStyle(clusterStyle);
}

centros.setStyle(new M.style.Cluster());
