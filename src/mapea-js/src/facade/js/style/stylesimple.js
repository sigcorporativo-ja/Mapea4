goog.provide('M.style.Simple');

goog.require('M.style.Feature');

/**
 * @namespace M.style.Simple
 */
(function() {

  /**
   * Abstract class
   *
   * @api stable
   */
  M.style.Simple = (function(options, impl) {
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Simple, M.style.Feature);

  /**
   * @inheritDoc
   */
  M.style.Simple.prototype.apply = function(layer, applyToFeature) {
    this.layer_ = layer;
    this.getImpl().applyToLayer(layer);
    if (applyToFeature === true) {
      layer.getFeatures().forEach(feature => feature.setStyle(this.clone()));
    }
    this.updateCanvas();
  };

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api stable
   */
  Object.defineProperty(M.style.Simple.prototype, "ORDER", {
    value: 1
  });
})();
