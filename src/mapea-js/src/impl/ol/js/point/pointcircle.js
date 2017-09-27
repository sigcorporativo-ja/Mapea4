goog.provide('M.impl.style.PointCircle');

goog.require('goog.style');
goog.require('ol.style.Circle');

/**
 * @namespace M.impl.style.PointCircle
 */
(function() {
  /**
   * @classdesc
   * chart style for vector features
   *
   * @constructor
   * @param {object} options - Options style PointCircle
   * @extends {ol.style.Circle}
   * @api stable
   */
  M.impl.style.PointCircle = function(options = {}) {
    // super call
    ol.style.Circle.call(this, {
      points: Infinity,
      fill: options.fill,
      radius: options.radius,
      snapToPixel: options.snapToPixel,
      stroke: options.stroke,
      atlasManager: options.atlasManager
    });
    this.forceGeometryRender_ = M.utils.isBoolean(options.forceGeometryRender) ? options.forceGeometryRender : false;
  };
  ol.inherits(M.impl.style.PointCircle, ol.style.Circle);

  /**
   * clones the chart
   * @public
   * @function
   * @api stable
   */
  M.impl.style.PointCircle.prototype.clone = function() {};

  /**
   * Chart radius setter & getter
   * setter will render the chart
   */
  Object.defineProperty(M.impl.style.PointCircle.prototype, 'radius', {
    get: function() {
      return this.radius_;
    },
    set: function(radius) {
      this.radius_ = radius;
    }
  });

  /**
   * Draws in a vector context a "center point" as feature and applies it this chart style.
   * This draw only will be applied to geometries of type POLYGON or MULTI_POLYGON.
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.PointCircle.prototype.forceRender_ = function(feature, style, ctx) {
    if (feature.getGeometry() == null) {
      return;
    }
    //console.log('geometry', feature.getGeometry());

    let center = M.impl.utils.getCentroidCoordinate(feature.getGeometry());
    if (center != null) {
      let tmpFeature = new ol.Feature({
        geometry: new ol.geom.Point(center)
      });
      ctx.drawFeature(tmpFeature, style);
    }
  };

})();
