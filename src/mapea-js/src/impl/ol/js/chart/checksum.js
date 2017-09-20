goog.provide('ol.structs.IHasChecksum');

(function() {
  /**
   * @interface
   */
  ol.structs.IHasChecksum = function() {
  };


  /**
   * @return {string} The checksum.
   */
  ol.structs.IHasChecksum.prototype.getChecksum = function() {
  };
})();
