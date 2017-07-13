goog.provide('M.style.Polygon');

/**
 * @namespace M.style.Polygon
 */
(function() {

  /**
   * TODO
   */
  M.style.Polygon = (function(options) {
    // calls the super constructor
    goog.base(this, options);
  });
  goog.inherits(M.style.Polygon, M.style.Simple);

  /**
   * TODO
   */
  M.style.Simple.prototype.applyToFeature_ = function(feature) {
    /*no se que tiene que hacer esto...*/
    this.getImpl().applyToFeature_(feature);
  };

  /**
   * TODO
   */
  M.style.Simple.prototype.serialize = function() {
    // TODO
  };
})();
