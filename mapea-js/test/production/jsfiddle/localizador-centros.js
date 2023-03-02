//https://juntadeandalucia.es/organismos/culturaypatrimoniohistorico/servicios/localizador-centros.html?

var mapajs = M.map({
  container: "map",
  wmcfiles: ["mapa"],
  controls: ['mouse', 'layerswitcher', 'panzoombar']
});


/* OPCION 1: Generamos los features como GeoJSON con las coordenadas
geograficas, y luego lo añadimos tal cual a la capa en tiempo de construccion
*/
let featsGeoJSON = [{
    properties: {
      nombre: "Archivo de la Real Chancillería de Granada",
      direccion: "Plaza del Padre Suárez 1, 18009 Granada"
    },
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-3.5955906, 37.174637]
    }
  },
  {
    properties: {
      nombre: "Archivo Histórico Provincial de Sevilla",
      direccion: "Calle Alcazabilla S/N, 29015 Málaga"
    },
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-4.41721737, 36.7219099]
    }
  }
];

let layer1 = new M.layer.GeoJSON({
  source: {
    crs: {
      properties: {
        name: "EPSG:4326"
      },
      type: "name"
    },
    features: featsGeoJSON,
    type: "FeatureCollection"
  },
  name: 'prueba'
});

layer1.setStyle(new M.style.Point({
  fill: {
    color: 'blue',
  }
}));

mapajs.addLayers(layer1);

/* OPCION 2: Cuando los features se añaden despues de tener ya la capa en el mapa: Creamos la capa vacia. Los features se añaden posteriormente,
por lo que hay que reproyectarlos antes*/
let layer2 = new M.layer.GeoJSON({
  name: "Prueba",
  crs: "25830"
});

layer2.setStyle(new M.style.Point({
  fill: {
    color: 'red',
  }
}));

mapajs.addLayers(layer2);


function añadirFeature() {
  // Creamos feature con cordenadas geograficas
  var miFeature = new M.Feature("featurePrueba001", {
    properties: {
      nombre: "Archivo Histórico Provincial de Cádiz",
      direccion: "Calle Almirante Apodaca 4, 41003 Sevilla"
    },
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-5.989253, 37.39265]
    }
  });

  // Reproyectamos feature
  console.log('Transformamos la geometria: ', miFeature.getGeometry());
  miFeature.getImpl().getOLFeature().getGeometry().transform('EPSG:4326', 'EPSG:25830');
  console.log('Transformada; ', miFeature.getGeometry());

  layer2.addFeatures([miFeature]);


}
