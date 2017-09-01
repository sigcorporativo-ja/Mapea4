goog.provide('M.impl.style.Simple');

goog.require('M.impl.Style');

/**
 * @namespace M.impl.style.Simple
 */
(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @api stable
   */
  M.impl.style.Simple = (function(options = {}) {
    goog.base(this, options);
  });
  goog.inherits(M.impl.style.Simple, M.impl.Style);
})();
