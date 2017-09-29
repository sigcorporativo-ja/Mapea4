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
  };
  ol.inherits(M.impl.style.PointCircle, ol.style.Circle);

  /**
   * clones the chart
   * @public
   * @function
   * @api stable
   */
  M.impl.style.PointCircle.prototype.clone = function() {
    let style = new M.impl.style.PointCircle({
      fill: this.getFill() ? this.getFill().clone() : undefined,
      stroke: this.getStroke() ? this.getStroke().clone() : undefined,
      radius: this.getRadius(),
      snapToPixel: this.getSnapToPixel(),
      atlasManager: this.atlasManager_
    });
    style.setOpacity(this.getOpacity());
    style.setScale(this.getScale());
    return style;
  };

})();
