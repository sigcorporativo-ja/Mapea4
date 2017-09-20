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
})();
