goog.provide('M.style.Line');

/**
 * @namespace M.style.Polygon
 */
(function() {

  /**
   * TODO
   */
  M.style.Line = (function(options) {
    var impl = new M.impl.style.Line(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Line, M.style.Simple);

  /**
   * TODO
   */
  M.style.Line.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };

  /**
   * TODO
   */
  M.style.Line.prototype.serialize = function() {
    // TODO
  };
})();
