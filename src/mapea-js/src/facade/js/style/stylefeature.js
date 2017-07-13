goog.provide('M.style.Feature');

/**
 * TODO
 */
(function() {

  /**
   * TODO
   */
  M.style.Feature = (function(options = {}) {
    // calls the super constructor
    goog.base(this, options);
  });
  goog.inherits(M.style.Feature, M.Style);


  /**
   * TODO
   * Como es protected no se rellena
   */
  M.style.Feature.prototype.apply_ = function(layer) {
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
