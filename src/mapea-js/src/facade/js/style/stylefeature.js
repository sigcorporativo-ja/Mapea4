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
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Feature, M.Style);


  /**
   * This function apply style to feature
   *
   * @protected
   * @param {M.Feature} feature - Feature to apply style
   * @function
   */
  M.style.Feature.prototype.applyToFeature_ = function(feature) {};
})();
