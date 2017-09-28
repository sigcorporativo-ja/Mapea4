goog.provide('M.impl.renderer.vector');

/**
 * @namespace M.impl.renderer.vector
 */
(function(){

  M.impl.renderer.vector.renderPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
    if (style instanceof M.impl.style.OLStyle && style.getImage() != null) {
      M.impl.renderer.vector.drawGeometryCentroidAsFeature(replayGroup, geometry, style, feature);
    } else {
      ol.renderer.vector.renderPolygonGeometry_(replayGroup, geometry, style, feature);
    }
  };

  M.impl.renderer.vector.renderMultiPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
    if (style instanceof M.impl.style.OLStyle && style.getImage() != null) {
      M.impl.renderer.vector.drawGeometryCentroidAsFeature(replayGroup, geometry, style, feature);
    } else {
      ol.renderer.vector.renderMultiPolygonGeometry_(replayGroup, geometry, style, feature);
    }
  };

  M.impl.renderer.vector.renderLineStringGeometry_ = function(replayGroup, geometry, style, feature) {
    if (style instanceof M.impl.style.OLStyle && style.getImage() != null) {
      M.impl.renderer.vector.drawGeometryCentroidAsFeature(replayGroup, geometry, style, feature);
    } else {
      ol.renderer.vector.renderLineStringGeometry_(replayGroup, geometry, style, feature);
    }
  };

  M.impl.renderer.vector.renderMultiLineStringGeometry_ = function(replayGroup, geometry, style, feature) {
    if (style instanceof M.impl.style.OLStyle && style.getImage() != null) {
      M.impl.renderer.vector.drawGeometryCentroidAsFeature(replayGroup, geometry, style, feature);
    } else {
      ol.renderer.vector.renderMultiLineStringGeometry_(replayGroup, geometry, style, feature);
    }
  };

  M.impl.renderer.vector.drawGeometryCentroidAsFeature = function(replayGroup, geometry, style, feature) {
    let centroid = M.impl.utils.getCentroidCoordinate(geometry);
    let geom = new ol.geom.Point(centroid);
    let tmpFeature = new ol.Feature({
        geometry: geom
    });
    ol.renderer.vector.GEOMETRY_RENDERERS_[geom.getType()](replayGroup, geom, style, feature);
  };

  Object.assign(ol.renderer.vector.GEOMETRY_RENDERERS_, {
    'LineString': M.impl.renderer.vector.renderLineStringGeometry_,
    'Polygon': M.impl.renderer.vector.renderPolygonGeometry_,
    'MultiPolygon': M.impl.renderer.vector.renderMultiPolygonGeometry_,
    'MultiLineString': M.impl.renderer.vector.renderMultiLineStringGeometry_
  });

})();
