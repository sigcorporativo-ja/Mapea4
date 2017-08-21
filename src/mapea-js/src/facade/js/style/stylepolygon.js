goog.provide('M.style.Polygon');

/**
 * @namespace M.style.Polygon
 */
(function() {

  /**
   * @classdesc
   * Creates a style polygon
   * @constructor
   * @extends {M.style.Simple}   *
   * @param {Object} options - options style
   * @api stable
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
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
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
