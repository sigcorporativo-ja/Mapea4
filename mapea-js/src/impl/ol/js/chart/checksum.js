goog.provide('ol.structs.IHasChecksum');

(function() {
  /**
   * @interface
   */
  ol.structs.IHasChecksum = function() {
  };


  /**
   * checksum getter
   * @return {string} The checksum.
   * @function
   * @api stable
   */
  ol.structs.IHasChecksum.prototype.getChecksum = function() {
  };
})();
