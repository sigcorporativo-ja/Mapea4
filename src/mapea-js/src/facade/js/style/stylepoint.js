goog.provide('M.style.Point');

/**
 * @namespace M.style.Polygon
 */
(function() {

  /**
   * TODO
   */
  M.style.Point = (function(options) {
    /**
     * TODO
     */
    var impl = new M.impl.style.Point(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Point, M.style.Simple);

  /**
   * TODO
   */
  M.style.Point.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };

  /**
   * TODO
   */
  M.style.Point.prototype.serialize = function() {
    // TODO
  };
})();
