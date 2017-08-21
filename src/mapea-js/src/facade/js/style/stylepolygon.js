goog.provide('M.style.Polygon');
goog.require('M.style.Simple');


goog.require('M.style.Simple');
/**
 * @namespace M.style.Polygon
 */
(function() {

  /**
   * TODO
   */
  M.style.Polygon = (function(options) {
    options = options || M.style.Polygon.OPTS_DEFAULT;
    /**
     * TODO
     */
    var impl = new M.impl.style.Polygon(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Polygon, M.style.Simple);

  /**
   * TODO
   */
  M.style.Polygon.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };

  /**
   * TODO
   */
  M.style.Polygon.prototype.serialize = function() {
    // TODO
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Polygon.OPTS_DEFAULT = {
    stroke: {
      width: 1
    }
  };
})();
