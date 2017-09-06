let mapajs = M.map({
  container: "mapjs",
  wmcfile: "callejero",
  controls: ["mouse", "layerswitcher", ]
});

let style = new M.style.Line({
  fill: {
    color: 'red',
    width: 20
  },
  stroke: {
    color: 'black',
    width: 20
  },

  radius: 2

});

let feature = new M.Feature('feature', {
  "type": "Feature",
  "properties": {
    "styleType": "public"
  },
  "geometry": {
    "type": "LineString",

    "coordinates": [
      [362192.7844, 4117738.3979],
      [372192.7844, 4117738.3979],
      [382192.7844, 4078501.2712]

    ]
  }
}, style);


let style2 = new M.style.Line({
  fill: {
    color: 'green',
    width: 20
  },
  stroke: {
    color: 'black',
    width: 20
  },
  radius: 2

});
let feature2 = new M.Feature('feature2', {
  "type": "Feature",
  "properties": {
    "styleType": "concertado"
  },
  "geometry": {
    "type": "LineString",

    "coordinates": [
      [509448.9020, 4135936.8778],
      [512192.7844, 4117738.3979],
      [512193.7844, 4178501.2712]

    ]
  }
}, style2);

let style3 = new M.style.Line({
  fill: {
    color: 'pink',
    width: 20
  },
  stroke: {
    color: 'black',
    width: 20
  },
  radius: 2

});
let feature3 = new M.Feature('feature3', {
  "type": "Feature",
  "properties": {
    "styleType": "privado"
  },
  "geometry": {
    "type": "LineString",

    "coordinates": [
      [439448.9020, 4135936.8778],
      [432192.7844, 4117738.3979],
      [432193.7844, 4178501.2712]

    ]
  }
}, style3);

let feature4 = new M.Feature('feature4', {
  "type": "Feature",
  "properties": {
    "styleType": "hibrido"
  },
  "geometry": {
    "type": "LineString",

    "coordinates": [
      [279448.9020, 4135936.8778],
      [272192.7844, 4117738.3979],
      [272193.7844, 4178501.2712]

    ]
  }
}, style);







let layer = new M.layer.Vector({
  name: 'layerVector'
});
layer.addFeatures([feature, feature2, feature3, feature4]);

mapajs.addLayers([layer]);


// mapajs.addPlugin(new M.plugin.AttributeTable({
//   "pages": "10"
// }));




function cambiarGeometry1() {
  //capaGeoJSON.addFeatures([feature2,feature3]);
  //console.log('Cambiando geometría al feature2....');
  //console.log('Geometría anterior: ');
  //console.log(feature2.getGeometry());
  //console.log(capaGeoJSON.getFeatures()[0].getGeometry());

  feature2.setGeometry(geometry1);

  //console.log('Geometría nueva: ');
  //console.log(feature2.getGeometry());
  //console.log(capaGeoJSON.getFeatures()[0].getGeometry());
  //mapajs.refresh();
  //capaGeoJSON.refresh();
  //feature2.setAttribute({"nombre":"feture2_modif"});
  //capaGeoJSON.addFeatures([feature2]);

  //capaGeoJSON.redraw();

  //mapajs.refresh();
}
