goog.provide('M.style.Feature');

/**
 * TODO
 */
(function() {

  /**
   * TODO
   */
  M.style.Feature = (function(options = {}, impl) {
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Feature, M.Style);


  /**
   * TODO
   * Como es protected no se rellena
   */
  M.style.Feature.prototype.apply_ = function(layer) {
    goog.base(this, 'apply_', layer);
    layer.getFeatures().forEach(function(f) {
      this.applyToFeature_(f);
    }, this);
  };

  /**
   * TODO
   * Como es protected no se rellena
   */
  M.style.Feature.prototype.applyToFeature_ = function(element) {};
})();
