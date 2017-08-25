M.ZOOM_LEVELS = 31;

window.mapajs = M.map({
  "controls": ["mouse", "panzoombar", "panzoom", "navtoolbar", "layerswitcher", "overviewmap", "scale", "scaleline", "location"],
  "container": "map",
  "layers": [new M.layer.OSM({
    'transparent': true
  })],
  "projection": "EPSG:3857*m",
  "zoom": 19,
  "center": [-245406, 5986536]
});

let ignf = new M.layer.GeoJSON({
  'name': 'ignf',
  'url': 'http://viglino.github.io/ol3-ext/examples/data/ignf.json'
})
mapajs.addLayers(ignf);

// 	// Create layer
// 	var vectorSource = new ol.source.Vector(
// 	{	url: 'data/ignf.json',
// 		// projection: 'EPSG:3857',
// 		format: new ol.format.GeoJSON(),
// 		attributions: [new ol.Attribution({ html: "&copy; <a href='http://professionnels.ign.fr/bdtopo'>ign.fr</a>" })]
// 	});
// 	var vector = new ol.layer.Vector(
// 		{	source: vectorSource,
// 			maxResolution: 2
// 		});
// 	map.addLayer(vector);
//
// 	var dbpSource = new ol.source.Vector(
// 	{	url: 'data/dbpedia.json',
// 		format: new ol.format.GeoJSON(),
// 		attributions: [ new ol.Attribution({ html: "&copy; DBPedia" }) ]
// 	});
// 	var dbp = new ol.layer.Vector(
// 	{	source: dbpSource
// 	});
// 	map.addLayer(dbp);
//
// Set 3D renderer
var vector = ignf.getImpl().getOL3Layer();
vector.setMaxResolution(2);
var vectorSource = ignf.getImpl().getOL3Layer().getSource();
var r3D = new ol.render3D({
  height: 0,
  maxResolution: 0.6,
  defaultHeight: 3.5
});
vector.setRender3D(r3D);
var listenerKey = vectorSource.on('change', function (e) {
  if (vectorSource.getState() == 'ready') {
    ol.Observable.unByKey(listenerKey)
    setTimeout(doAnime, 200);
  }
});

var height = 0;

function doAnime() {
  if (r3D.animating()) return;
  height = height ? 0 : "HAUTEUR";
  r3D.animate({
    height: height
  });
}
