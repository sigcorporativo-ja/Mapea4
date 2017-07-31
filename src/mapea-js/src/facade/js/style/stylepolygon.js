goog.provide('M.style.Polygon');

/**
 * @namespace M.style.Polygon
 */
(function() {

  /**
   * TODO
   */
  M.style.Polygon = (function(options) {
    /**
     * TODO
     */
    var impl = new M.impl.style.Polygon(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Polygon, M.style.Simple);

  /**
   * TODO
   */
  M.style.Polygon.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };

  /**
   * TODO
   */
  M.style.Polygon.prototype.serialize = function() {
    // TODO
  };
})();
