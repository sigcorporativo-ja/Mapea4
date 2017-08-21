goog.provide('M.style.Line');

/**
 * @namespace M.style.Line
 */
(function() {

  /**
   * @classdesc
   * Creates a style line
   * @constructor
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api stable
   */
  M.style.Line = (function(options) {
    options = options || M.style.Line.OPTS_DEFAULT;
    var impl = new M.impl.style.Line(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Line, M.style.Simple);

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   */
  M.style.Line.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };

  /**
   * TODO
   */
  M.style.Line.prototype.serialize = function() {
    // TODO
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Line.OPTS_DEFAULT = {
    stroke: {
      width: 1
    }
  };
})();
