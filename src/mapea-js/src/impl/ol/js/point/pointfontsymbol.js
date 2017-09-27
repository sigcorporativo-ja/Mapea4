goog.provide('M.impl.style.PointFontSymbol');

goog.require('goog.style');
goog.require('ol.style.FontSymbol');

/**
 * @namespace M.impl.style.PointFontSymbol
 */
(function() {
  /**
   * @classdesc
   * chart style for vector features
   *
   * @constructor
   * @param {object} options - Options style PointFontSymbol
   * @extends {ol.style.FontSymbol}
   * @api stable
   */
  M.impl.style.PointFontSymbol = function(options = {}) {
    if (!options.anchor) {
      options.anchor = [];
    }
    if (!options.offset) {
      options.offset = [];
    }
    // super call
    ol.style.FontSymbol.call(this, {
      glyph: options.glyph,
      color: options.color,
      fontSize: options.fontSize,
      stroke: options.stroke,
      fill: options.fill,
      radius: options.radius,
      form: options.form,
      gradient: options.gradient,
      offsetX: options.offset[0],
      offsetY: options.offset[1],
      opacity: options.opacity,
      rotation: options.rotation,
      rotateWithView: options.rotateWithView
    });
    this.forceGeometryRender_ = M.utils.isBoolean(options.forceGeometryRender) ? options.forceGeometryRender : false;
  };
  ol.inherits(M.impl.style.PointFontSymbol, ol.style.FontSymbol);

  /**
   * clones the chart
   * @public
   * @function
   * @api stable
   */
  M.impl.style.PointFontSymbol.prototype.clone = function() {};

  /**
   * Chart radius setter & getter
   * setter will render the chart
   */
  Object.defineProperty(M.impl.style.PointFontSymbol.prototype, 'radius', {
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
  M.impl.style.PointFontSymbol.prototype.forceRender_ = function(feature, style, ctx) {
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
