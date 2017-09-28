goog.provide('M.impl.renderer.vector');

/**
 * @namespace M.impl.renderer.vector
 */
(function(){

  M.impl.renderer.vector.renderPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
    ol.renderer.vector.renderPolygonGeometry_(replayGroup, geometry, style, feature);
    if (style instanceof M.style.Point) {
      console.log('render M.style.Point')
    }
  };

  M.impl.renderer.vector.renderMultiPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
    if (style.getImage() != null) {
      let centroid = M.impl.utils.getCentroidCoordinate(geometry);
      let geom = new ol.geom.Point(centroid);
     	let tmpFeature = new ol.Feature({
       		geometry: geom
    	});
      ol.renderer.vector.GEOMETRY_RENDERERS_[geom.getType()](replayGroup, geom, style, feature);
    } else {
      ol.renderer.vector.renderMultiPolygonGeometry_(replayGroup, geometry, style, feature);
    }
  };

  M.impl.renderer.vector.renderLineStringGeometry_ = function(replayGroup, geometry, style, feature) {

  };

  M.impl.renderer.vector.renderMultiLineStringGeometry_ = function(replayGroup, geometry, style, feature) {

  };

  Object.assign(ol.renderer.vector.GEOMETRY_RENDERERS_, {
    'Polygon': M.impl.renderer.vector.renderPolygonGeometry_,
    'MultiPolygon': M.impl.renderer.vector.renderMultiPolygonGeometry_
  });

})();
