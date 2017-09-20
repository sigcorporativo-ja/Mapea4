goog.provide('M.style.Feature');
goog.require('M.Style');

/**
 * @namespace M.style.Feature
 */

(function() {

  /**
   * Abstract class
   *
   * @api stable
   */
  M.style.Feature = (function(options, impl) {
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Feature, M.Style);

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   * @api stable
   */
  M.style.Feature.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };
})();
